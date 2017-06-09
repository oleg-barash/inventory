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
    SHOW_LOADING,
    HIDE_LOADING,
    START_IMPORT,
    STOP_IMPORT,
    SET_CURRENT_ITEM
} from '../constants/actionTypes'
import {toastr} from 'react-redux-toastr'

export function filterItems(filter){
    return { 
        type: FILTER_ITEMS, 
        filter,
        // meta: {
        //     throttle: {
        //         wait: 3000,
        //         leading: false
        //         } // wait time
        // } 
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

export function loadCurrentItem(id, inventorization, userToken){
    return function (dispatch){
        dispatch(showLoading())
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/item?id=' + id, { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch(hideLoading())
                dispatch(setCurrentItem(json))
            })
    }
}


export function importItems(items, company, userToken){
    return function (dispatch){
        dispatch(startImport())
        return fetch(process.env.API_URL + 'company/' + company + '/import', {
            method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(items)})
            .then(response => {
                dispatch(stopImport())
                if (!response.ok){
                    toastr.error("Произошла ошибка при импорте товаров")
                }
                else{
                    toastr.success("Справочник успешно импортирован")
                }
            })
    }  
}
export function saveItem(item, company, userToken){
        return function (dispatch){
            return fetch(process.env.API_URL + 'company/' + company + '/item', {
                method: "POST",
                    headers: {
                        "Authorization": userToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)})
                .then(response => {
                    if (!response.ok){
                        toastr.error("Произошла ошибка при создании действия ")
                    }
                    else{
                        toastr.success("Товар успешно сохранён")
                        dispatch(itemSaved(item))
                    }
                })
    }
}

export function fetchItems(inventorization, filter, userToken){
    return function (dispatch){
        dispatch(requestItems())
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/items', { headers: { "Authorization": userToken } })
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

function showLoading(){
    return {
        type: SHOW_LOADING
    }
}

function hideLoading(){
    return {
        type: HIDE_LOADING
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

function startImport(){
    return {
        type: START_IMPORT
    }
}

function stopImport(){
    return {
        type: STOP_IMPORT
    }
}