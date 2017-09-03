/**
 * Created by Барашики on 07.04.2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { browserHistory, Router } from 'react-router';
import routes from './routes';
var actionshub = $.connection.actionsHub;
actionshub.client.addAction = function (action) {
  console.log(message);
};
debugger
$.connection.hub.url = "http://localhost/signalr"
$.connection.hub.start().done(function () {
  debugger
  console.log("signalr connected");
  actionshub.server.connect("manager")
});

const component = (
  <CookiesProvider>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </CookiesProvider>
);

ReactDOM.render(component, document.getElementById('app'));