import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Instrument from './Instrument';
import LiveReduction from './LiveReduction';
import ReductionHistory from './ReductionHistory';
import HomePage from './HomePage';
import GlobalStyles from './GlobalStyles';

const App: FC = () => (
  <GlobalStyles>
    <Router basename="/ir">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/instruments">
          <Instrument />
        </Route>
        <Route path="/reduction-history">
          <ReductionHistory />
        </Route>
        <Route path="/live-reduction/:instrumentName">
          <LiveReduction />
        </Route>
        <Route path="/reduction-history/:instrumentName">
          <ReductionHistory />
        </Route>
      </Switch>
    </Router>
  </GlobalStyles>
);

export default App;
