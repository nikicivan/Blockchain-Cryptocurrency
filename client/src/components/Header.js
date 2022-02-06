import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='header'>
      <img
        className='logo'
        src='https://www.eweek.com/wp-content/uploads/2020/10/Blockchain.logo_-2-scaled.jpg'
      />
      <div className='header__links'>
        <Link to='/'>
          <p>Home</p>
        </Link>
        <Link to='/blocks'>
          <p>Blocks</p>
        </Link>
        <Link to='/conduct-transaction'>
          <p>Conduct a transaction</p>
        </Link>
        <Link to='/transaction-pool'>
          <p>Transaction pool</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
