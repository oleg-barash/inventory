import { LOGIN_FINISHED, LOGIN_IN_PROCESS, PASSWORD_CHANGED, LOGIN_CHANGED, LOGOUT, OPEN_INVENTORIZATION_DIALOG, CLOSE_INVENTORIZATION_DIALOG, INVENTORIZATION_SELECTED } from '../constants/actionTypes'
import { Cookies } from 'react-cookie';

export function auth(state = { IsAuthorized: false, InProcess: false  }, action)
{
    switch (action.type){
        case LOGIN_IN_PROCESS:
            return Object.assign({}, state, { InProcess: true });
        case LOGIN_FINISHED:
            return Object.assign({}, state, action.userInfo, { InProcess: false });    
        case PASSWORD_CHANGED:
            return Object.assign({}, state, { password: action.password });    
        case LOGIN_CHANGED:
            return Object.assign({}, state, { login: action.login });    
        case LOGOUT:
            return { IsAuthorized: false };
        case OPEN_INVENTORIZATION_DIALOG: 
            return Object.assign({}, state, { isInventorizationDialogOpened: true });
        case CLOSE_INVENTORIZATION_DIALOG:
            return Object.assign({}, state, { isInventorizationDialogOpened: false });
        case INVENTORIZATION_SELECTED:
            return Object.assign({}, state, { SelectedInventorization: action.inventorization });
        default:
            return state
    }
}