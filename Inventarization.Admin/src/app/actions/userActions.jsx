import fetch from 'isomorphic-fetch'
import { 
    FETCH_USERS,
    USERS_RECEIVED,
    DELETE_USER,
    USER_DELETED,
    USER_SAVED,
    SET_CURRENT_USER,
    VALIDATE_USER 
} from '../constants/actionTypes'
export function fetchUsers(userToken) {
    return function (dispatch) {
        dispatch({ type: FETCH_USERS });
        return fetch(process.env.API_URL + 'user/list', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: USERS_RECEIVED, users: json})
            })
    }
}

export function deleteUser(user, token){
    return function (dispatch) {
        dispatch({ type: DELETE_USER, user: user });
        return fetch(process.env.API_URL + 'user', { method: 'DELETE', headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: USER_DELETED, user: user})
            })
    }
}

export function validateUser(user){
    return {
        type: VALIDATE_USER,
        data: user
    }
}

export function saveUser(user, userToken){
        return function (dispatch){
            return fetch(process.env.API_URL + 'user/info', {
                method: "POST",
                    headers: {
                        "Authorization": userToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)})
                .then(response => { return response.json()})
                .then(response => {
                    debugger;
                    if (typeof response === "string" || response.ErrorMessage){
                        toastr.error("Произошла ошибка при сохранении пользователя: " + response.ErrorMessage)
                    }
                    else{
                        toastr.success("Информация о пользователе успешно сохранена")
                        dispatch(userSaved(user))
                    }
                })
    }
}

export function loadUser(id, userToken){
    return function (dispatch){
        return fetch(process.env.API_URL + 'user/info?id=' + id, {withCredentials: false, method: 'GET', headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch(setCurrentUser(json))
            })
    }
}

export function setCurrentUser(user){    
    return {
        type: SET_CURRENT_USER,
        user
    }
}

export function userSaved(user){
    return {
        type: USER_SAVED,
        user
    }
}

