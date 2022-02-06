import React, { useState, useEffect } from 'react';
import axios from '../services/axios';

const WaletInfo = () => {
  const [walletInfo, setWalletInfo] = useState({
    address: '',
    balance: 0,
  });

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const request = await axios.get('/api/wallet-info');
      setWalletInfo({
        address: request.data.address,
        balance: request.data.balance,
      });
      return request;
    };
    fetchWalletInfo();
  }, []);

  return (
    <div>
      <div className='walletInfo'>
        <h1>Welcome to the blockchain</h1>
        <h3>Address: {walletInfo.address}</h3>
        <h3>Balance: {walletInfo.balance}</h3>
      </div>
    </div>
  );
};

export default WaletInfo;
