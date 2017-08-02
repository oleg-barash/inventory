import fetch from 'isomorphic-fetch'
import { 
    RECEIVE_DICTIONARY,
    REQUEST_DICTIONARY,
    LOAD_MORE_DICTIONARY_ITEMS,
    UPDATE_DICTIONARY_ITEMS_FILTER,
    SET_DICTIONARY_ITEMS_LOADING,
    FILTER_DICTIONARY_ITEMS,
    SHOW_DICTIONARY_LOADING,
    HIDE_DICTIONARY_LOADING
} from '../constants/actionTypes'
import {toastr} from 'react-redux-toastr'

export function filterItems(filter){
    return { 
        type: FILTER_DICTIONARY_ITEMS, 
        filter,
    }
}

export function setItemsLoading(){
    return { 
        type: SET_DICTIONARY_ITEMS_LOADING, 
    }
}

export function updateItemsFilter(filter){
    return { 
        type: UPDATE_DICTIONARY_ITEMS_FILTER, 
        filter
    }
}

export function requestItems(){
    return { type: REQUEST_DICTIONARY }
}

export function fetchItems(company, filter, userToken){
    return function (dispatch){
        dispatch(requestItems())
        return fetch(process.env.API_URL + 'company/' + company + '/items', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json =>
                dispatch(receiveItems(json, filter))
            )
    }
}

function showLoading(){
    return {
        type: SHOW_DICTIONARY_LOADING
    }
}

function hideLoading(){
    return {
        type: HIDE_DICTIONARY_LOADING
    }
}

function receiveItems(data, filter){
    return {
        type: RECEIVE_DICTIONARY,
        items: data, 
        filter,
        receivedAt: Date.now()
    }
}
