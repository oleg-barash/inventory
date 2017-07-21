import fetch from 'isomorphic-fetch'
import { 
    RECEIVE_RESTS,
    REQUEST_RESTS
} from '../constants/actionTypes'

export function requestRests(){
    return { type: REQUEST_RESTS }
}

export function fetchRests(inventorization, userToken){
    return function (dispatch){
        dispatch(requestRests())
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/rests', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json =>
                dispatch(receiveRests(json))
            )
    }
}

function receiveRests(data){
    return {
        type: RECEIVE_RESTS,
        items: data, 
        receivedAt: Date.now()
    }
}