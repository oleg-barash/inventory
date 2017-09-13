import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import { reducer as toastrReducer } from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReduxToastr from 'react-redux-toastr'
import PropTypes from 'prop-types';
import throttle from "redux-throttle";

import { actionList } from './reducers/actionListReducers'
import { itemList } from './reducers/itemListReducers'
import { item } from './reducers/itemReducers'
import { action } from './reducers/actionReducers'
import { zoneList } from './reducers/zoneReducers'
import { global } from './reducers/globalReducers'
import { auth } from './reducers/authorizationReducers'
import users from './reducers/userListReducers'
import user from './reducers/userReducers'
import report from './reducers/reportReducers'
import rests from './reducers/restReducers'
import company from './reducers/companyReducers'
import inventorization from './reducers/inventorizationReducers'
import dictionary from './reducers/dictionaryReducers'

import AuthStatus from './components/user/authStatus'
import LeftMenu from './components/user/leftMenu'
import InventorizationDialog from './components/inventorizationDialog'

import { withCookies } from 'react-cookie';
import { LOGIN_FINISHED
    , LOGOUT
    , INVENTORIZATION_SELECTED
    , CLOSE_INVENTORIZATION_DIALOG
    , TOGGLE_DRAWER
    , ACTION_SAVED} from './constants/actionTypes'
import { toggleDrawer } from './actions/globalActions'
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
        if (typeof document !== "undefined") { // на сервере фиг знает как выставить куки в этом middleware
            let state = getState();
            switch (action.type) {
                case LOGIN_FINISHED:
                    if (action.userInfo.IsAuthorized) {
                        action.userInfo.Token = "Basic " + btoa(action.userInfo.Username + ":" + action.userInfo.Password)
                        state.auth = action.userInfo
                        document.cookie = "UserData=" + JSON.stringify(action.userInfo)
                        browserHistory.push('/items');
                    }
                    else {
                        delete document.cookie;
                        browserHistory.push('/login');
                    }
                    break
                case INVENTORIZATION_SELECTED:
                    //browserHistory.push('/items');
                    state.auth.SelectedInventorization = action.inventorization;
                    document.cookie = "UserData=" + JSON.stringify(state.auth);
                    break
                case LOGOUT:
                    document.cookie = "UserData="
                    browserHistory.push('/login');
                    break
                // case ACTION_SAVED:
                //     browserHistory.push('/editAction?id=' + action.id);
            }
        }

        return returnValue
    }
}

injectTapEventPlugin();
const loggerMiddleware = createLogger()
const middleware = [thunkMiddleware
    , loggerMiddleware
    , throttleMiddleware
    , authCookies];
let store = createStore(
    combineReducers({
        actions: actionList,
        items: itemList,
        zones: zoneList,
        toastr: toastrReducer,
        item,
        action,
        auth,
        global,
        users,
        user,
        report,
        rests,
        company,
        inventorization,
        dictionary
    }),
    applyMiddleware(...middleware));


const propTypes = {
    children: PropTypes.node
};

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { dispatch } = this.props;
        const childrenWithCookies = React.Children.map(this.props.children,
            (child) => {
                return React.cloneElement(child,
                    {
                        cookies: this.props.cookies
                    })
            }
        );
        let handleToggle = function () {
            store.dispatch(toggleDrawer());
        };

        if (typeof $ !== "undefined") {
            try {
                var actionshub = $.connection.actionsHub;
                if (actionshub !== undefined) {
                    actionshub.client.addAction = function (action) {
                        store.dispatch({ type: ACTION_SAVED, action });
                    };
                    $.connection.hub.url = "http://localhost/signalr"
                    $.connection.hub.start().done(function () {
                        console.log("signalr connected");
                    });
                }
            }
            catch (ex) {
                console.warn("signalr not connected!!! reason: " + ex);
            }
        }

        return (

            <MuiThemeProvider>
                <Provider store={store}>
                    <div>
                        <AppBar title="Инвентаризация"
                            onLeftIconButtonTouchTap={handleToggle}
                            iconClassNameRight="muidocs-icon-navigation-expand-more"
                            iconElementRight={<AuthStatus cookies={this.props.cookies} />}
                        />
                        <LeftMenu />
                        <div>
                            {childrenWithCookies}
                            <ReduxToastr
                                timeOut={4000}
                                newestOnTop={false}
                                preventDuplicates={true}
                                position="top-left"
                                transitionIn="fadeIn"
                                transitionOut="fadeOut"
                                progressBar />
                        </div>
                        <InventorizationDialog cookies={this.props.cookies} />
                    </div>
                </Provider>
            </MuiThemeProvider>);
    }
}
App.propTypes = propTypes;
export default withCookies(App)