import fetch from 'isomorphic-fetch'
import {
    USAGE_OPENED,
    USAGE_CLOSED,
    USAGE_CLEARED
} from '../constants/actionTypes'


export function fetchUsages(zone, inventorizationId, userToken) {
    return function (dispatch) {
        dispatch(requestZones())
        return fetch(process.env.API_URL + 'usages/list',
            {
                headers: { "Authorization": userToken },
                body: JSON.stringify({ inventorizationId: inventorization, zoneId: zone.Id })
            })
            .then(response => response.json())
            .then(json =>
                dispatch(receiveZones(json))
            )
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
                body: JSON.stringify({ inventorizationId: inventorization, zoneId: zone.Id, type })
            })
            .then(response => {
                dispatch(usageOpened(zone, type))
                dispatch(fetchUsages(zone, userToken))
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
                body: JSON.stringify({ inventorizationId: inventorization, zoneId: zone.Id, type })
            })
            .then(response => {
                dispatch(usageClosed(zone, type))
                dispatch(fetchUsages(zone, userToken))
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
                body: JSON.stringify({ inventorizationId: inventorization, zoneId: zone.Id, type })
            })
            .then(response => {
                dispatch(usageCleared(zone))
                dispatch(fetchUsages(zone, userToken))
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