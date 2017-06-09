import fetch from 'isomorphic-fetch'
import { 
    REQUEST_ZONES,
    RECEIVE_ZONES,
    ZONE_OPENED,
    ZONE_CLOSED,
} from '../constants/actionTypes'

export function fetchZones(inventorization, userToken){
    return function (dispatch){
        dispatch(requestZones())
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/zones', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json =>
                dispatch(receiveZones(json))
            )
    }
}

export function openZone(zone, inventorization, userToken){
    return function (dispatch){
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/zone/reopen?code=' + zone.Code, { headers: { "Authorization": userToken } })
            .then(response => {
                dispatch(zoneOpened(zone))
                dispatch(fetchZones(inventorization, userToken))
            })
    }
}

export function closeZone(zone, inventorization, userToken){
    return function (dispatch){
        debugger;
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/zone/close',
            {method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({zoneId: zone.ZoneId})})
            .then(response => {
                dispatch(zoneClosed(zone))
                dispatch(fetchZones(inventorization, userToken))
            })
    }
}

export function clearZone(zone, inventorization, userToken){
    return function (dispatch){
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/zone/clear',
            {method: "POST",
                headers: {
                    "Authorization": userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({zoneId: zone.ZoneId})})
            .then(response => {
                dispatch(zoneClosed(zone))
                dispatch(fetchZones(inventorization, userToken))
            })
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

function receiveZones(data){
    return {
        type: RECEIVE_ZONES,
        items: data,
        receivedAt: Date.now()
    }
}

function requestZones(inventarization){
    return { type: REQUEST_ZONES, inventarization}
}