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
import { auth } from './reducers/authorizationReducers'
import { createLogger } from 'redux-logger'
import {reducer as toastrReducer} from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReduxToastr from 'react-redux-toastr'
import PropTypes from 'prop-types';
import throttle from "redux-throttle";
import UserControl from './components/userControl'
import InventorizationDialog from './components/inventorizationDialog'
import { withCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { LOGIN_FINISHED, LOGOUT, INVENTORIZATION_SELECTED, CLOSE_INVENTORIZATION_DIALOG } from './constants/actionTypes'
import { browserHistory } from 'react-router'

const defaultWait = 30000
const defaultThrottleOption = {
  leading: true,
  trailing: true
}

const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);

function authCookies({ getState }) {
  return (next) => (action) => {
    let returnValue = next(action)
    if (typeof document !== "undefined"){ // на сервере фиг знает как выставить куки в middleware
        let state = getState();
        switch (action.type){
            case LOGIN_FINISHED:
            case INVENTORIZATION_SELECTED:
            case CLOSE_INVENTORIZATION_DIALOG:
                debugger
                document.cookie = 'credentials=' + escape(JSON.stringify(state.auth));
                break
            case LOGOUT:
                document.cookie = 'credentials=';
                browserHistory.push('/login');
                break
        }
    }

    return returnValue
  }
}

injectTapEventPlugin();
const loggerMiddleware = createLogger()
const middleware = [thunkMiddleware,loggerMiddleware,throttleMiddleware, authCookies];
let store = createStore(
    combineReducers({ actions: actionList, items: itemList, zones: zoneList, toastr: toastrReducer, item, action, auth  }),
    applyMiddleware(...middleware));


const propTypes = {
 children: PropTypes.node
};

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const childrenWithCookies = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, 
                {
                    cookies: this.props.cookies
                })
            );
        return (
            
        <MuiThemeProvider>
            <Provider store={store}>
                <div>
                    <AppBar title="Title" 
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        iconElementRight={<UserControl cookies={this.props.cookies}/>}
                    />
                    <div>
                        <ul>
                            <li><Link to="/items">Товары</Link></li>
                            <li><Link to="/actions">Действия</Link></li>
                            <li><Link to="/zones">Зоны</Link></li>
                        </ul>
                        { childrenWithCookies }
                        <ReduxToastr
                            timeOut={4000}
                            newestOnTop={false}
                            preventDuplicates={true}
                            position="top-left"
                            transitionIn="fadeIn"
                            transitionOut="fadeOut"
                            progressBar/>
                    </div>
                    <InventorizationDialog cookies={this.props.cookies}/>
                </div>
            </Provider>
        </MuiThemeProvider>);
    }
}
App.propTypes = propTypes;
export default withCookies(App)