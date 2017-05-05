/**
 * Created by �������� on 11.03.2017.
 */
import fetch from 'isomorphic-fetch'
import { FILTER_ACTION,
    REQUEST_ACTION,
    RECEIVE_ACTION,
    RECEIVE_ITEMS,
    REQUEST_ITEMS,
    ACTION_DELETED,
    DELETING_ACTION,
    REQUEST_ZONES,
    RECEIVE_ZONES,
    ZONE_OPENED,
    ZONE_CLOSED,
    CREATE_ITEM,
    VALIDATE_ITEM,
    SAVE_ITEM,
    ITEM_SAVED,
    SET_CURRENT_ITEM,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    FILTER_ITEMS} from '../constants/actionTypes'
import { BASE_URL } from '../constants/configuration'
export function filterActions(filter){
    return { type: FILTER_ACTION, filter }
}

export function filterItems(filter){
    return { type: FILTER_ITEMS, filter }
}


function requestActions(inventarization){
    return { type: REQUEST_ACTION, inventarization}
}

function requestItems(inventarization){
    return { type: REQUEST_ITEMS, inventarization}
}

function requestZones(inventarization){
    return { type: REQUEST_ZONES, inventarization}
}

function receiveActions(data){
    return {
        type: RECEIVE_ACTION,
        items: data,
        receivedAt: Date.now()
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

function receiveZones(data){
    return {
        type: RECEIVE_ZONES,
        items: data,
        receivedAt: Date.now()
    }
}

function actionDeleted(action){
    return {
        type: ACTION_DELETED,
        action: action
    }
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

function zoneOpened(zone){
    return {
        type: ZONE_OPENED,
        action: zone
    }
}

function zoneClosed(zone){
    return {
        type: ZONE_CLOSED,
        action: zone
    }
}


export function validateItem(itemData){
    return {
        type: VALIDATE_ITEM,
        data: itemData
    }
}

function deletingAction(action){
    return {
        type: DELETING_ACTION,
        id: action.Id
    }
}

export function deleteAction(action){
    return function (dispatch){
        dispatch(deletingAction(action))
        return fetch(BASE_URL + 'action', {method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:action.Id})})
            .then(response => {
                dispatch(actionDeleted(action))
                dispatch(fetchActions('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
            })
    }
}

export function addItemFromAction(action){
    return {
        type: CREATE_ITEM,
        item: {
            BarCode: action.BarCode
        }
    }
}

export function itemSaved(item){
    return {
        type: ITEM_SAVED,
        item
    }
}



export function setCurrentItem(item){
    return {
        type: SET_CURRENT_ITEM,
        item
    }
}




export function openZone(zone){
    return function (dispatch){
        return fetch(BASE_URL + 'inventorization/' + '81d51f07-9ff3-46c0-961c-c8ebfb7b47e3' + '/zone/reopen?code=' + zone.Code)
            .then(response => {
                dispatch(zoneOpened(zone))
                dispatch(fetchZones('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
            })
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
                    dispatch(itemSaved(item))
                })
    }
}

export function closeZone(zone){
    return function (dispatch){
        return fetch(BASE_URL + 'inventorization/' + '81d51f07-9ff3-46c0-961c-c8ebfb7b47e3' + '/zone/close',
            {method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: zone.Code})
            .then(response => {
                dispatch(zoneClosed(zone))
                dispatch(fetchZones('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
            })
    }
}





export function fetchActions(inventorization){
    return function (dispatch){
        dispatch(requestActions(inventorization))
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/actions')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveActions(json))
            )
    }
}

export function fetchItems(inventorization, filter){
    return function (dispatch){
        dispatch(requestItems(inventorization))
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/items')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveItems(json, filter))
            )
    }
}

export function fetchZones(inventorization){
    return function (dispatch){
        dispatch(requestItems(inventorization))
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/zones')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveZones(json))
            )
    }
}