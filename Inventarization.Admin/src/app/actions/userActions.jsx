import fetch from 'isomorphic-fetch'
import { FETCH_USERS, USERS_RECEIVED } from '../constants/actionTypes'
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