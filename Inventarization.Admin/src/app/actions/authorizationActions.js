import fetch from 'isomorphic-fetch'
import { LOGIN, 
    LOGIN_RESULT,
    LOGIN_CHANGED,
    LOGIN_IN_PROCESS,
    LOGIN_FINISHED,
    PASSWORD_CHANGED,
    OPEN_INVENTORIZATION_DIALOG,
    INVENTORIZATION_SELECTED,
    CLOSE_INVENTORIZATION_DIALOG,
    LOGOUT } from '../constants/actionTypes'
import {toastr} from 'react-redux-toastr'

function hash(string){
    var hash = 0;
    if (string.length == 0) return hash;
    let char = '';
    for (let i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


export function login(username, password){
    return function (dispatch){
        dispatch(loginInProcess())
    let userInfo = { Username: username, Password: /*hash(*/password/*)*/ };
    debugger
        return fetch(process.env.API_URL + 'user/login', 
            {  
                method: "POST",
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(userInfo)})
            .then(response => {
                return response.json()
            })
            .then(json => {
                dispatch(loginFinished(json))
            })
    }
}

export function passwordChanged(passwordValue){
    return {
        type: PASSWORD_CHANGED,
        password: passwordValue
    }
}

export function logout(){
    return function (dispatch){
        return fetch(process.env.API_URL + 'user/logout', { method: 'POST'})
            .then(json => {
                return {
                    type: LOGOUT
                }
            })
    }
}

export function loginChanged(loginValue){
    return {
        type: LOGIN_CHANGED,
        login: loginValue
    }
}


export function loginFinished(userInfo){
    return {
        type: LOGIN_FINISHED,
        userInfo
    }
}

function loginInProcess(){
    return {
        type: LOGIN_IN_PROCESS
    }
}

export function openInventorizationDialog(){
    return {
        type: OPEN_INVENTORIZATION_DIALOG
    }
}

export function closeInventorizationDialog(){
    return {
        type: CLOSE_INVENTORIZATION_DIALOG
    }
}

export function setInventorization(inventorization){
    return {
        type: INVENTORIZATION_SELECTED,
        inventorization
    }
}
