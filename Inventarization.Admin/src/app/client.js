/**
 * Created by Барашики on 07.04.2017.
 */
import React      from 'react';
import ReactDOM   from 'react-dom';

import { browserHistory, Router } from 'react-router';
import routes from './routes';
const component = (
  <Router history={browserHistory}>
    {routes}
  </Router>
);

ReactDOM.render(component, document.getElementById('app'));