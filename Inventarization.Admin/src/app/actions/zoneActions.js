import fetch from 'isomorphic-fetch'
import { 
    REQUEST_ZONES,
    RECEIVE_ZONES,
    ZONE_OPENED,
    ZONE_CLOSED,
} from '../constants/actionTypes'
import { BASE_URL } from '../constants/configuration'

export function fetchZones(inventorization){
    return function (dispatch){
        dispatch(requestZones())
        return fetch(BASE_URL + 'inventorization/' + inventorization + '/zones')
            .then(response => response.json())
            .then(json =>
                dispatch(receiveZones(json))
            )
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