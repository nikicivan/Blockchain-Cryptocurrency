import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

const Block = ({ block }) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);

  const hashDisplay = `${block?.hash.substring(0, 25)}...`;
  const stringifyData = JSON.stringify(block?.data);

  const dataDisplay = () => (
    <>
      {stringifyData.length > 15
        ? `${stringifyData.substring(0, 35)}...`
        : stringifyData}
      <br />
      <Button
        bsstyle='primary'
        bssize='small'
        onClick={toggleTransaction}
        style={{ outlineWidth: 0, marginTop: '1.7rem' }}
      >
        Show more
      </Button>
    </>
  );

  const toggleTransaction = () => {
    setDisplayTransaction(!displayTransaction);
  };

  const fullDataDisplay = () => (
    <>
      {block?.data?.map((transaction) => (
        <div key={transaction?.id}>
          <hr />
          <Transaction transaction={transaction} />
        </div>
      ))}
      <br />
      <Button
        bsstyle='primary'
        bssize='small'
        onClick={toggleTransaction}
        style={{ outlineWidth: 0, marginTop: '1.7rem' }}
      >
        Show Less
      </Button>
    </>
  );

  return (
    <div className='block'>
      <p>Hash: {hashDisplay}</p>
      <p>Timestamp: {new Date(block?.timestamp).toLocaleDateString()}</p>
      <div>Data: {!displayTransaction ? dataDisplay() : fullDataDisplay()}</div>
    </div>
  );
};

export default Block;
