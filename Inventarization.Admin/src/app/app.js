import React, { Component }  from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import {
  Link
} from 'react-router'
import { actionList } from './reducers/actionListReducers'
import { itemList } from './reducers/itemListReducers'
import { item } from './reducers/itemReducers'
import { action } from './reducers/actionReducers'
import { zoneList } from './reducers/zoneReducers'
import { createLogger } from 'redux-logger'
import {reducer as toastrReducer} from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReduxToastr from 'react-redux-toastr'
import PropTypes from 'prop-types';
import throttle from "redux-throttle";

const defaultWait = 30000
const defaultThrottleOption = {
  leading: true,
  trailing: true
}

const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);

injectTapEventPlugin();
const loggerMiddleware = createLogger()
const middleware = [thunkMiddleware,loggerMiddleware,throttleMiddleware];
let store = createStore(
    combineReducers({ actions: actionList, items: itemList, zones: zoneList, toastr: toastrReducer, item, action  }),
    applyMiddleware(...middleware));


const propTypes = {
 children: PropTypes.node
};

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <MuiThemeProvider>
            <div>
                <AppBar title="Title" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
                <Provider store={store}>
                    <div>
                        <ul>
                            <li><Link to="/login">Авторизация</Link></li>
                            <li><Link to="/items">Товары</Link></li>
                            <li><Link to="/actions">Действия</Link></li>
                            <li><Link to="/zones">Зоны</Link></li>
                            <li><Link to="/report">Отчёты</Link></li>
                        </ul>
                        {this.props.children}
                        <ReduxToastr
                            timeOut={4000}
                            newestOnTop={false}
                            preventDuplicates={true}
                            position="top-left"
                            transitionIn="fadeIn"
                            transitionOut="fadeOut"
                            progressBar/>
                    </div>
                </Provider>
            </div>
        </MuiThemeProvider>);
    }
}
App.propTypes = propTypes;
export default App