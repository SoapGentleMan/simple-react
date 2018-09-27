import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Container from './pages/index'

export default () => (
  <Router>
    <Switch>
      <Route path="/" component={Container}/>
    </Switch>
  </Router>
);

