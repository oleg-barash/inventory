import fetch from 'isomorphic-fetch'
import { FILTER_ACTION,
    REQUEST_ACTION,
    RECEIVE_ACTION,
    ACTION_DELETED,
    DELETING_ACTION,
    SET_CURRENT_ACTION,
    VALIDATE_ACTION,
    SHOW_LOADING,
    HIDE_LOADING,
    UPDATE_ACTIONS_FILTER,
    ACTION_SAVED
} from '../constants/actionTypes'
import {toastr} from 'react-redux-toastr'

export function addItemFromAction(action){
    return {
        type: CREATE_ITEM,
        item: {
            BarCode: action.BarCode
        }
    }
}

export function loadCurrentAction(id){
    return function (dispatch){
        dispatch(showLoading())
        return fetch(process.env.API_URL + 'action?id=' + id)
            .then(response => response.json())
            .then(json => {
                dispatch(hideLoading())
                dispatch(setCurrentAction(json))
            })
    }
}

export function setCurrentAction(action){    
    return {
        type: SET_CURRENT_ACTION,
        action
    }
}

export function validateAction(actionData){
    return {
        type: VALIDATE_ACTION,
        data: actionData
    }
}

export function saveAction(action, inventorization){
        return function (dispatch){
            return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/action', {
                method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.assign({}, action, { Zone: action.Zone.ZoneId}))})
                .then(response => { return response.json()})
                .then(response => {
                    debugger;
                    if (typeof response === "string" || response.ErrorMessage){
                        toastr.error("Произошла ошибка при создании действия: " + response.ErrorMessage)
                    }
                    else{
                        toastr.success("Действие успешно сохранено")
                        dispatch(actionSaved(action))
                    }
                })
    }
}

export function actionSaved(action){
    return {
        type: ACTION_SAVED,
        action
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

export function fetchActions(inventorization){
    return function (dispatch){
        dispatch(requestActions(inventorization))
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/actions')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveActions(json))
            )
    }
}

export function deleteAction(action){
    return function (dispatch){
        dispatch(deletingAction(action))
        return fetch(process.env.API_URL + 'action', {method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:action.Id})})
            .then(response => {
                dispatch(actionDeleted(action))
                dispatch(fetchActions(action.Inventorization))
            })
    }
}

function deletingAction(action){
    return {
        type: DELETING_ACTION,
        id: action.Id
    }
}

function actionDeleted(action){
    return {
        type: ACTION_DELETED,
        action: action
    }
}

function receiveActions(data){
    return {
        type: RECEIVE_ACTION,
        items: data,
        receivedAt: Date.now()
    }
}

function requestActions(inventarization){
    return { type: REQUEST_ACTION, inventarization}
}

export function filterActions(filter){
    return { type: FILTER_ACTION, filter }
}

export function updateActionsFilter(filter){
    return { 
        type: UPDATE_ACTIONS_FILTER, 
        filter
    }
}