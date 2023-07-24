import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme';
import Instrument from './Instrument';
import LiveReduction from './LiveReduction';
import ReductionHistory from './ReductionHistory';

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
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
  </ThemeProvider>
);

export default App;
