import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Instrument from './Instrument';
import LiveReduction from './LiveReduction';
import ReductionHistory from './ReductionHistory';

const App: FC = () => (
  <Router basename="/ir">
    <Switch>
      <Route exact path="/">
        <Instrument />
      </Route>
      <Route path="/live-reduction">
        <LiveReduction />
      </Route>
      <Route path="/reduction-history">
        <ReductionHistory />
      </Route>
    </Switch>
  </Router>
);

export default App;
