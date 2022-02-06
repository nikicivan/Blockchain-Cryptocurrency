const express = require('express');
const request = require('request');
const TransactionMiner = require('./app/transaction-miner');
const Blockchain = require('./blockchain/blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const PubSub = require('./app/pubsub');
const path = require('path');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(cors());

// Initializing classes
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

const DEFAULT_PORT = 8000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
  res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;

  const blocksReversed = blockchain.chain.slice().reverse();

  let startIndex = (id - 1) * 5;
  let endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransaction();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({
      chain: blockchain.chain,
      address,
    }),
  });
});

app.get('/api/know-addresses', (req, res) => {
  const addressMap = {};

  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      const recipients = Object.keys(transaction.outputMap);

      recipients.forEach((recipient) => (addressMap[recipient] = recipient));
    }
  }

  res.json(Object.keys(addressMap));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
  request(
    {
      url: `${ROOT_NODE_ADDRESS}/api/blocks`,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log('replace chain on a sync with: ', rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionMap = JSON.parse(body);

        console.log(
          'replace transaction pool map on a synch with ',
          rootTransactionMap
        );
        transactionPool.setMap(rootTransactionMap);
      }
    }
  );
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
  const transaction = wallet.createTransaction({
    recipient,
    amount,
    chain: blockchain.chain,
  });

  transactionPool.setTransaction(transaction);
};

const walletAction = () =>
  generateWalletTransaction({
    wallet,
    recipient: walletFoo.publicKey,
    amount: 5,
  });

const walletActionFoo = () =>
  generateWalletTransaction({
    wallet: walletFoo,
    recipient: walletBar.publicKey,
    amount: 10,
  });

const walletActionBar = () =>
  generateWalletTransaction({
    wallet: walletBar,
    recipient: wallet.publicKey,
    amount: 15,
  });

for (let i = 0; i < 10; i++) {
  if (i % 3 === 0) {
    walletAction();
    walletActionFoo();
  } else if (i % 3 === 1) {
    walletAction();
    walletActionBar();
  } else {
    walletActionFoo();
    walletActionBar();
  }

  transactionMiner.mineTransaction();
}

// Error Handler
app.use(errorHandler);

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
