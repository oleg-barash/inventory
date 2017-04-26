import React, { Component }  from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import {
  Link
} from 'react-router'
import { actionList } from './reducers/actionReducers'
import { itemList } from './reducers/itemReducers'
import { zoneList } from './reducers/zoneReducers'
import { createLogger } from 'redux-logger'
import {reducer as toastrReducer} from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReduxToastr from 'react-redux-toastr'
import PropTypes from 'prop-types';
injectTapEventPlugin();
const loggerMiddleware = createLogger()

let store = createStore(
    combineReducers({ actions: actionList, items: itemList, zones: zoneList, toastr: toastrReducer }),
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
));


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