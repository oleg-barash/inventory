import {
    COMPANY_LOADING,
    COMPANY_LOADED,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    COMPANY_LIST_LOADING,
    COMPANY_LIST_LOADED,
    COMPANY_SAVING,
    COMPANY_SAVED,
    VALIDATE_COMPANY,
    HIDE_COMPANY_LOADING,
    START_IMPORT,
    STOP_IMPORT,
    VALIDATE_DATA,
    DATA_VALIDATED,
    PARSE_DATA,
    DATA_IMPORTED
} from '../constants/actionTypes';

export default function company(state = { isLoading: false, isListLoading: false, isImportDialogOpened: false, importInProgress: false }, action) {
    switch (action.type) {
        case COMPANY_LOADING:
        case COMPANY_SAVING:
        case COMPANY_SAVED:
            return Object.assign({}, state, { isLoading: true })
        case COMPANY_LOADED:
            return Object.assign({}, state, { isLoading: false, company: action.company })
        case HIDE_COMPANY_LOADING:
            return Object.assign({}, state, { isLoading: false })
        case VALIDATE_COMPANY:
            action.company.NameError = !!action.company.Name ? '' : 'Укажите название компании';
            let company = Object.assign({}, state.company, action.company);
            return Object.assign({}, state, { isLoading: false, company })
        case COMPANY_LIST_LOADING:
            return Object.assign({}, state, { isListLoading: true })
        case COMPANY_LIST_LOADED:
            return Object.assign({}, state, { isListLoading: false, list: action.list })
        case OPEN_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: true })
        case CLOSE_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: false })
        case START_IMPORT:
            return Object.assign({}, state, {
                importInProgress: true
            })
        case STOP_IMPORT:
            return Object.assign({}, state, {
                importInProgress: false
            })
        case PARSE_DATA:
            let rows = action.data.split("\n");
            let itemsToUpload = rows.map((row) => {
                let columns = row.split(",")
                return {
                    BarCode: columns[0],
                    Name: columns[1],

                }
            });
            return Object.assign({}, state, { dataForImport: itemsToUpload })
        case DATA_IMPORTED:
            return Object.assign({}, state, { dataForImport: undefined, importInProgress: false })
        default: return state
    }
}