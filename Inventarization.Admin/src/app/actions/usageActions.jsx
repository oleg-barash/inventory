import fetch from 'isomorphic-fetch'
import {
    USAGE_UPDATED, USAGES_LOADED
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
                toastr.success(zone.ZoneName + " успешно открыта для " + getTypeText(type));
                return response.json();
            })
            .then(json => dispatch(receiveUsages(zone, json)))
    }
}

export function closeUsage(zone, inventorizationId, type, userToken) {
    return function (dispatch) {
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
                toastr.warning(zone.ZoneName + " успешно закрыта для " + getTypeText(type));
                return response.json();
            })
            .then(json => dispatch(receiveUsages(zone, json)))
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
                toastr.warning("Зона " + zone.ZoneName + " успешно очщена");
                return response.json();
            })
            .then(json => dispatch(receiveUsages(zone, json)))
    }
}

function usageUpdated(usage) {
    return {
        type: USAGE_UPDATED,
        usage
    }
}

function receiveUsages(zone, usages) {
    return {
        type: USAGES_LOADED,
        zone: zone,
        usages
    }
}