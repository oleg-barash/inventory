/**
 * Created by Барашики on 07.04.2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { browserHistory, Router } from 'react-router';
import routes from './routes';

const component = (
  <CookiesProvider>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </CookiesProvider>
);

ReactDOM.render(component, document.getElementById('app'));