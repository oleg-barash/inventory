import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { actionList } from './reducers/actionReducers'
import { itemList } from './reducers/itemReducers'

import Main from './Main.js';
import Login from './Login.js';
import { createLogger } from 'redux-logger'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
const loggerMiddleware = createLogger()

let store = createStore(
    combineReducers({ actions: actionList, items: itemList }),
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    ));

render(
    <MuiThemeProvider>
        <div>
            <AppBar title="Title" iconClassNameRight="muidocs-icon-navigation-expand-more" />
            <Provider store={store}>
                <Router>
                    <div>
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/login">Авторизация</Link></li>
                        </ul>
                        <hr/>
                        <Route exact path="/" component={Main}/>
                        <Route path="/login" component={Login}/>
                    </div>
                </Router>
            </Provider>
        </div>
    </MuiThemeProvider>,
  	document.getElementById('app')
);