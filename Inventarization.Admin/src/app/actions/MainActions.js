/**
 * Created by Барашики on 11.03.2017.
 */
import fetch from 'isomorphic-fetch'
import { FILTER_ACTION, REQUEST_ACTION, RECEIVE_ACTION, RECEIVE_ITEMS, REQUEST_ITEMS} from '../constants/actionTypes'
import { BASE_URL } from '../constants/configuration'

export function applyFilter(filter){
    return { type: FILTER_ACTION, filter }
}

function requestActions(inventarization){
    return { type: REQUEST_ACTION, inventarization}
}

function requestItems(inventarization){
    return { type: REQUEST_ITEMS, inventarization}
}

function receiveActions(data){
    return {
        type: RECEIVE_ACTION,
        items: data,
        receivedAt: Date.now()
    }
}

function receiveItems(data){
    return {
        type: RECEIVE_ITEMS,
        items: data,
        receivedAt: Date.now()
    }
}


export function fetchActions(inventorization){
    return function (dispatch){
        dispatch(requestActions(inventorization))
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/actions')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveActions((inventorization, json)))
            )
    }
}

export function fetchItems(inventorization){
    return function (dispatch){
        dispatch(requestItems(inventorization))
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/items')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveItems((inventorization, json)))
            )
    }
}