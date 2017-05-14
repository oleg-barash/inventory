import fetch from 'isomorphic-fetch'
import { 
    RECEIVE_ITEMS,
    REQUEST_ITEMS,
    CREATE_ITEM,
    VALIDATE_ITEM,
    SAVE_ITEM,
    ITEM_SAVED,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    LOAD_MORE_ITEMS,
    UPDATE_ITEMS_FILTER,
    SET_ITEMS_LOADING,
    FILTER_ITEMS,
    SET_CURRENT_ITEM
} from '../constants/actionTypes'
import { BASE_URL } from '../constants/configuration'
import {toastr} from 'react-redux-toastr'

export function filterItems(filter){
    return { 
        type: FILTER_ITEMS, 
        filter,
        meta: {
            throttle: {
                wait: 3000,
                leading: false
                } // wait time
        } 
    }
}

export function setItemsLoading(){
    return { 
        type: SET_ITEMS_LOADING, 
    }
}

export function updateItemsFilter(filter){
    return { 
        type: UPDATE_ITEMS_FILTER, 
        filter
    }
}

export function requestItems(){
    return { type: REQUEST_ITEMS }
}

export function openImportDialog(){
    return {
        type: OPEN_IMPORT_DIALOG
    }
}

export function closeImportDialog(){
    return {
        type: CLOSE_IMPORT_DIALOG
    }
}

export function validateItem(itemData){
    return {
        type: VALIDATE_ITEM,
        data: itemData
    }
}

export function setCurrentItem(item){
    return {
        type: SET_CURRENT_ITEM,
        item
    }
}

export function saveItem(item){
        return function (dispatch){
            return fetch(BASE_URL + 'company/' + '9e0e8591-293d-4603-898d-59334e4c53dc' + '/item', {
                method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)})
                .then(response => {
                    debugger;
                    if (!response.ok){
                        toastr.error("Произошла ошибка при создании действия ")
                    }
                    else{
                        toastr.success("Товар успешно создан")
                        dispatch(itemSaved(item))
                    }
                })
    }
}

export function fetchItems(inventorization, filter){
    return function (dispatch){
        dispatch(requestItems())
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/items')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveItems(json, filter))
            )
    }
}

export function itemSaved(item){
    return {
        type: ITEM_SAVED,
        item
    }
}


function receiveItems(data, filter){
    return {
        type: RECEIVE_ITEMS,
        items: data, 
        filter,
        receivedAt: Date.now()
    }
}