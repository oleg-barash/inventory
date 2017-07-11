import { REPORT_LOAD_INV3, REPORT_LOAD_IN_PROCESS, REPORT_LOAD_FINISHED } from '../constants/actionTypes'
import fetch from 'isomorphic-fetch'
export function loadINV3(inventarizationId, userToken){
    return function (dispatch){
        dispatch(showLoading())
        return fetch(process.env.API_URL + 'report/'+ inventarizationId + '/inv3', { headers: { "Authorization": userToken } })
            .then(response => response.blob())
            .then(blob => {
                dispatch(hideLoading())
                window.open( URL.createObjectURL(blob),'_blank');

            })
    }
}

export function showLoading(){
    return {
        type: REPORT_LOAD_IN_PROCESS
    }
}

export function hideLoading(){
    return {
        type: REPORT_LOAD_FINISHED
    }
}
