import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Instrument from './Instrument';
import LiveReduction from './LiveReduction';
import ReductionHistory from './ReductionHistory';
import HomePage from './HomePage';
import DataViewer from './DataViewer';
import GlobalStyles from './GlobalStyles';

const App: FC = () => {
  // Need to call forceUpdate if SciGateway tells us to rerender but there's no
  // forceUpdate in functional components, so this is the hooks equivalent. See
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  function handler(e: Event): void {
    // Attempt to re-render the plugin if we get told to
    const action = (e as CustomEvent).detail;
    if ('scigateway:api:plugin_rerender'.match(action)) {
      forceUpdate();
    }
  }

  React.useEffect(() => {
    document.addEventListener('scigateway', handler);
    return () => {
      document.removeEventListener('scigateway', handler);
    };
  }, []);

  return (
    <GlobalStyles>
      <Router basename="/ir">
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/instruments">
            <Instrument />
          </Route>
          <Route path="/reduction-history/ALF">
            <ReductionHistory />
          </Route>
          <Route path="/live-reduction/:instrumentName">
            <LiveReduction />
          </Route>
          <Route path="/reduction-history/:instrumentName">
            <ReductionHistory />
          </Route>
          <Route path="/data-viewer/:instrumentName">
            <DataViewer />
          </Route>
        </Switch>
      </Router>
    </GlobalStyles>
  );
};

export default App;
