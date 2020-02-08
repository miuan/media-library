import React from 'react';
import { Switch, Route } from 'react-router';
import routes from '../constants/routes.json';
import App from './App';
import HomePage from './library/libraryPage';
import CounterPage from './source/sourcePage';
import CopyPage from './copy/copyPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.COPY} component={CopyPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
