import { LOGIN_FINISHED, 
    LOGIN_IN_PROCESS,
    UPDATE_USER_INFO, 
    PASSWORD_CHANGED, 
    LOGIN_CHANGED, 
    LOGOUT, 
    OPEN_INVENTORIZATION_DIALOG, 
    CLOSE_INVENTORIZATION_DIALOG, 
    INVENTORIZATION_SELECTED,
    INVENTORIZATION_SAVED } from '../constants/actionTypes'
import { Cookies } from 'react-cookie';

function isInitializedFunction() {
    return this.Token != undefined && this.SelectedInventorization !== undefined;
}

export function auth(state = { IsAuthorized: false, InProcess: false, IsInitialized: isInitializedFunction }, action) {
    switch (action.type) {
        case LOGIN_IN_PROCESS:
            return Object.assign({}, state, { InProcess: true });
        case LOGIN_FINISHED:
            return Object.assign({ IsInitialized: isInitializedFunction }, action.userInfo, { InProcess: false });
        case PASSWORD_CHANGED:
            return Object.assign({}, state, { password: action.password });
        case LOGIN_CHANGED:
            return Object.assign({}, state, { login: action.login });
        case LOGOUT:
            return Object.assign({}, state, { IsAuthorized: false });
        case OPEN_INVENTORIZATION_DIALOG:
            return Object.assign({}, state, { isInventorizationDialogOpened: true });
        case CLOSE_INVENTORIZATION_DIALOG:
            return Object.assign({}, state, { isInventorizationDialogOpened: false });
        case INVENTORIZATION_SELECTED:
            return Object.assign({}, state, { SelectedInventorization: action.inventorization });
        case UPDATE_USER_INFO:
            return Object.assign({}, state, action.userInfo);
        case INVENTORIZATION_SAVED:
            return Object.assign({}, state, { Inventorizations: _.map(state.Inventorizations, item => item.Id == action.inventorization.Id ? action.inventorization : item) })
        default:
            return state
    }
}