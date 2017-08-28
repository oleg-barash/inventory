import fetch from 'isomorphic-fetch'
import {
    USAGE_OPENED,
    USAGE_CLOSED,
    USAGES_LOADED,
    USAGE_CLEARED
} from '../constants/actionTypes'
import {toastr} from 'react-redux-toastr'

export function fetchUsages(zone, inventorizationId, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'usage/list?inventorizationId=' + inventorizationId + '&zoneId=' + zone.Id,
            {
                headers: { "Authorization": userToken },
            })
            .then(response => response.json())
            .then(json =>
                dispatch(receiveUsages(json))
            )
    }
}

let getTypeText = function(type){
    switch(type){
        case 0: return "первого сканирования"
        case 1: return "повторного сканирования"
        case 2: return "слепого сканирования"
    }
}

export function openUsage(zone, inventorizationId, type, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'usage/reopen',
            {
                method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inventorizationId, zoneId: zone.Id, type })
            })
            .then(response => {
                toastr.success("Зона успешно открыта для " + getTypeText(type))
                dispatch(usageOpened(zone, type))
                dispatch(fetchUsages(zone, inventorizationId, userToken))
            })
    }
}

export function closeUsage(zone, inventorizationId, type, userToken) {
    return function (dispatch) {
        debugger;
        return fetch(process.env.API_URL + 'usage/close',
            {
                method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inventorizationId, zoneId: zone.Id, type })
            })
            .then(response => {
                dispatch(usageClosed(zone, type))
                dispatch(fetchUsages(zone, inventorizationId, userToken))
            })
    }
}

export function clearUsage(zone, inventorizationId, type, userToken) {
    return function (dispatch) {
        return fetch(process.env.API_URL + 'usage/clear',
            {
                method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inventorizationId, zoneId: zone.Id, type })
            })
            .then(response => {
                dispatch(usageCleared(zone))
                dispatch(fetchUsages(zone, inventorizationId, userToken))
            })
    }
}

function usageOpened(zone, type) {
    return {
        type: USAGE_OPENED,
        zone: zone,
        usageType: type
    }
}

function usageClosed(zone, type) {
    return {
        type: USAGE_CLOSED,
        zone: zone,
        usageType: type
    }
}

function usageCleared(zone, type) {
    return {
        type: USAGE_CLEARED,
        zone: zone,
        usageType: type
    }
}

function receiveUsages(zone, usages) {
    return {
        type: USAGES_LOADED,
        zone: zone,
        usages
    }
}