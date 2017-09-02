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
import { toastr } from 'react-redux-toastr'
import { browserHistory } from 'react-router'
export function fetchUsers(userToken) {
    return function (dispatch) {
        dispatch({ type: FETCH_USERS });
        return fetch(process.env.API_URL + 'user/list', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: USERS_RECEIVED, users: json })
            })
    }
}

export function deleteUser(user, userToken) {
    return function (dispatch) {
        debugger
        dispatch({ type: DELETE_USER, user: user });
        return fetch(process.env.API_URL + 'user/delete', {
            method: 'POST',
            headers: {
                "Authorization": userToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.status != 200) {
                    toastr.error("Ошибка при удалении пользователя: " + response.message);
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then(json => {
                if (json.status == "success") {
                    toastr.success("Пользователь удален");
                    dispatch({ type: USER_DELETED, user: user });
                    browserHistory.goBack();
                }
                else {
                    toastr.error("Ошибка при удалении пользователя: " + json.message);
                }
            })
    }
}

export function validateUser(user) {
    return {
        type: VALIDATE_USER,
        data: user
    }
}

export function saveUser(user, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'user/info', {
            method: "POST",
            headers: {
                "Authorization": userToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => { return response.json() })
            .then(response => {
                switch (response.status) {
                    case "validation_error":
                        dispatch(setCurrentUser(Object.assign({}, user, response.fields)));
                        break;
                    case "failed":
                        toastr.error("Произошла ошибка при сохранении пользователя: " + response.ErrorMessage);
                        break;
                    case "success":
                        toastr.success("Информация о пользователе успешно сохранена");
                        dispatch(userSaved(response.user));
                        dispatch(setCurrentUser(response.user));
                        browserHistory.push('/editUser?id=' + response.user.Id);
                        break;
                }
            })
    }
}

export function deassignUser(user, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'user/deassign', {
            method: "POST",
            headers: {
                "Authorization": userToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Id: user.Id })
        })
            .then(response => { return response.json() })
            .then(response => {
                switch (response.status) {
                    case "failed":
                        toastr.error("Произошла ошибка при откреплении пользователя: " + response.ErrorMessage);
                        break;
                    case "success":
                        toastr.success("Пользователь успешно откреплён от инвенторизации");
                        dispatch(userSaved(response.user));
                        break;
                }
            })
    }
}

export function assignUser(user, inventorization, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'user/assign', {
            method: "POST",
            headers: {
                "Authorization": userToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.assign({}, {Id: user, Inventorization: inventorization }))
        })
            .then(response => { return response.json() })
            .then(response => {
                switch (response.status) {
                    case "failed":
                        toastr.error("Произошла ошибка при назначении пользователя: " + response.ErrorMessage);
                        break;
                    case "success":
                        toastr.success("Пользователь успешно назначен на инвенторизацию");
                        dispatch(userSaved(response.user));
                        break;
                }
            })

    }
}



export function loadUser(id, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'user/info?id=' + id, { withCredentials: false, method: 'GET', headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch(setCurrentUser(json))
            })
    }
}

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}

export function userSaved(user) {
    return {
        type: USER_SAVED,
        user
    }
}

