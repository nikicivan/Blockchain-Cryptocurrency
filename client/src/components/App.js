import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Blocks from './Blocks';
import ConductTransaction from './ConductTransaction';
import Header from './Header';
import WaletInfo from './WaletInfo';
import TransactionPool from './TransactionPool';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Header />
        <Switch>
          <Route path='/transaction-pool' exact component={TransactionPool} />
          <Route
            path='/conduct-transaction'
            exact
            component={ConductTransaction}
          />
          <Route path='/blocks' exact component={Blocks} />
          <Route path='/' exact component={WaletInfo} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
