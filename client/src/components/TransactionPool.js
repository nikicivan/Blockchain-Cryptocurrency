import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from '../services/axios';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const history = useHistory();

  useEffect(() => {
    const fetchTransactionPool = async () => {
      const { data } = await axios.get('/api/transaction-pool-map');
      setTransactionPoolMap(data);
      return data;
    };
    fetchTransactionPool();
  }, []);

  const mineTransaction = async () => {
    const { request } = await axios.get('/api/mine-transactions');
    if (request.status === 200) {
      alert('Success');
      history.push('/blocks');
    } else {
      alert('The mine transaction block request did not complete!');
    }
  };

  return (
    <div>
      <h3>Transaction pool</h3>
      {Object.values(transactionPoolMap)?.map((transaction) => (
        <div key={transaction?.id}>
          <hr />
          <Transaction transaction={transaction} />
        </div>
      ))}
      <hr />
      <Button
        bsstyle='primary'
        bssize='small'
        onClick={mineTransaction}
        style={{ outlineWidth: 0, marginTop: '1.7rem', width: '100%' }}
      >
        Mine the transaction
      </Button>
    </div>
  );
};

export default TransactionPool;
