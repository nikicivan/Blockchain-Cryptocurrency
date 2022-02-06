import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import axios from '../services/axios';
import { useHistory } from 'react-router-dom';

const ConductTransaction = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [knownAddresses, setKnownAddresses] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const fetchKnownAddresses = async () => {
      const { data } = await axios.get('/api/know-addresses');
      setKnownAddresses([...knownAddresses, ...data]);
      return data;
    };
    fetchKnownAddresses();
  }, []);

  const conductTransaction = async () => {
    try {
      const { request } = await axios.post('/api/transact', {
        recipient,
        amount,
      });
      if (request.status === 200) {
        alert('You successfully conduct a new transaction');
        setRecipient('');
        setAmount(0);
        history.push('/transaction-pool');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='conductTransaction'>
      <h3>Conduct a Transaction</h3>
      <h4>Known Addresses</h4>
      {knownAddresses?.map((knownAddress, index) => (
        <div key={index}>
          <p>{knownAddress}</p>
          <br />
        </div>
      ))}

      <FormGroup>
        <FormControl
          input='text'
          placeholder='recipient'
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormControl
          input='number'
          placeholder='recipient'
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
      </FormGroup>
      <Button
        bsstyle='primary'
        bssize='small'
        onClick={conductTransaction}
        style={{ outlineWidth: 0, marginTop: '1.7rem', width: '100%' }}
      >
        Conduct
      </Button>
    </div>
  );
};

export default ConductTransaction;
