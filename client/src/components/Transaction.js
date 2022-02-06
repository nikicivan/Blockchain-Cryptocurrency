import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div>
      <p>From: {input?.address}</p>
      <p>Balance: {input?.amount}</p>
      {recipients?.map((recipient) => (
        <div key={recipient}>
          <p>To: {recipient}</p>
          <p>Sent: {outputMap[recipient]}</p>
        </div>
      ))}
    </div>
  );
};

export default Transaction;
