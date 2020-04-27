import React from 'react';
import { Switch, Route } from 'react-router';
import routes from '../constants/routes.json';
import App from './App';
import HomePage from './library/libraryPage';
import CounterPage from './source/sourcePage';
import CopyPage from './copy/copyPage';
import FilesPage from './files/filesPage'

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.COPY} component={CopyPage} />
      <Route path='/files/:where/:what' component={FilesPage} />
      <Route path={routes.HOME} component={HomePage} />
      
    </Switch>
  </App>
);
