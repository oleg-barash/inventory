import fetch from 'isomorphic-fetch'
import {
    INVENTORIZATION_LOADING,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    INVENTORIZATION_LOADED,
    INVENTORIZATION_SAVED,
    INVENTORIZATION_LIST_LOADING,
    INVENTORIZATION_LIST_LOADED,
    VALIDATE_INVENTORIZATION,
    INVENTORIZATION_SAVING,
    START_RESTS_IMPORT,
    STOP_RESTS_IMPORT,
    HIDE_INVENTORIZATION_LOADING,
    RESTS_DATA_IMPORTED
} from '../constants/actionTypes'
import { toastr } from 'react-redux-toastr'

export function loadInventorizations(userToken) {
    return function (dispatch) {
        dispatch({ type: INVENTORIZATION_LIST_LOADING });
        return fetch(process.env.API_URL + 'inventorization/list', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: INVENTORIZATION_LIST_LOADED, list: json })
            })
    }
}

export function loadInventorizationInfo(inventorizationId, userToken) {
    return function (dispatch) {
        dispatch({ type: INVENTORIZATION_LOADING });
        return fetch(process.env.API_URL + 'inventorization/' + inventorizationId, { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: INVENTORIZATION_LOADED, inventorization: json })
            })
    }
}

export function importRests(rests, inventorization, userToken) {
    return function (dispatch) {
        dispatch(startImport())
        return fetch(process.env.API_URL + 'inventorization/' + inventorization + '/rests', {
            method: "POST",
            headers: {
                "Authorization": userToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        })
            .then(response => {
                dispatch(dataImported())
                if (!response.ok) {
                    toastr.error("Произошла ошибка при импорте остатков")
                }
                else {
                    toastr.success("Справочник остатков успешно импортирован")
                }
            })
    }
}

export function openImportDialog() {
    return {
        type: OPEN_IMPORT_RESTS_DIALOG
    }
}

export function closeImportDialog() {
    return {
        type: CLOSE_IMPORT_RESTS_DIALOG
    }
}


export function validateInventorization(inventorization) {
    return { type: VALIDATE_INVENTORIZATION, inventorization }
}

export function saveInventorization(inventorization, token) {
    return function (dispatch) {
        dispatch({ type: INVENTORIZATION_SAVING });
        return fetch(process.env.API_URL + 'inventorization/save',
            {
                method: "POST",
                headers: {
                    "Authorization": token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inventorization)
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                toastr.success("Информация об инверторизации сохранена")
                dispatch({ type: INVENTORIZATION_SAVED, inventorization})
            })
            .catch(function () {
                toastr.error("Произошла ошибка при сохранении информации об инверторизации")
                dispatch({ type: HIDE_INVENTORIZATION_LOADING })
            });
    }
}

function startImport() {
    return {
        type: START_RESTS_IMPORT
    }
}

function stopImport() {
    return {
        type: STOP_RESTS_IMPORT
    }
}


function dataImported() {
    return {
        type: RESTS_DATA_IMPORTED
    }
}
