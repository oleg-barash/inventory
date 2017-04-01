/**
 * Created by Барашики on 11.03.2017.
 */
import fetch from 'isomorphic-fetch'
import { FILTER_ACTION, REQUEST_ACTION, RECEIVE_ACTION} from '../constants/actionTypes'

export function applyFilter(filter){
    return { type: FILTER_ACTION, filter }
}

function requestActions(inventarization){
    return { type: REQUEST_ACTION, inventarization}
}

function receiveActions(data){
    return {
        type: RECEIVE_ACTION,
        items: data,
        receivedAt: Date.now()
    }
}

export function fetchActions(inventorization){
    return function (dispatch){
        dispatch(requestActions(inventorization))
        return fetch('http://localhost/api/inventorization/' + inventorization + '/action')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveActions((inventorization, json)))
            )
    }
}