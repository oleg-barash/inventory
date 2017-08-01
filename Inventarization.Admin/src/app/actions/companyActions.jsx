import fetch from 'isomorphic-fetch'
import {
    COMPANY_LOADING,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    COMPANY_LOADED,
    COMPANY_SAVED,
    COMPANY_LIST_LOADING,
    COMPANY_LIST_LOADED,
    VALIDATE_COMPANY,
    COMPANY_SAVING,
    START_IMPORT,
    STOP_IMPORT,
    HIDE_COMPANY_LOADING,
    VALIDATE_DATA,
    DATA_VALIDATED,
    DATA_IMPORTED
} from '../constants/actionTypes'
import { toastr } from 'react-redux-toastr'

export function loadCompanies(userToken) {
    return function (dispatch) {
        dispatch({ type: COMPANY_LIST_LOADING });
        return fetch(process.env.API_URL + 'company/list', { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: COMPANY_LIST_LOADED, list: json })
            })
    }
}

export function loadCompanyInfo(companyId, userToken) {
    return function (dispatch) {
        dispatch({ type: COMPANY_LOADING });
        return fetch(process.env.API_URL + 'company/' + companyId, { headers: { "Authorization": userToken } })
            .then(response => response.json())
            .then(json => {
                dispatch({ type: COMPANY_LOADED, company: json })
            })
    }
}

export function importItems(items, company, userToken) {
    return function (dispatch) {
        dispatch(startImport())
        return fetch(process.env.API_URL + 'company/' + company + '/import', {
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
                    toastr.error("Произошла ошибка при импорте товаров")
                }
                else {
                    toastr.success("Справочник успешно импортирован")
                }
            })
    }
}

export function openImportDialog() {
    return {
        type: OPEN_IMPORT_DIALOG
    }
}

export function closeImportDialog() {
    return {
        type: CLOSE_IMPORT_DIALOG
    }
}


export function validateCompany(company) {
    return { type: VALIDATE_COMPANY, company }
}

export function saveCompany(company, token) {
    return function (dispatch) {
        dispatch({ type: COMPANY_SAVING });
        return fetch(process.env.API_URL + 'company/save',
            {
                method: "POST",
                headers: {
                    "Authorization": token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(company)
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                toastr.success("Информации о компании сохранена")
                dispatch({ type: COMPANY_SAVED })
            })
            .catch(function () {
                toastr.error("Произошла ошибка при сохранении информации о компании")
                dispatch({ type: HIDE_COMPANY_LOADING })
            });
    }
}

function startImport() {
    return {
        type: START_IMPORT
    }
}

function stopImport() {
    return {
        type: STOP_IMPORT
    }
}


function dataImported() {
    return {
        type: DATA_IMPORTED
    }
}
