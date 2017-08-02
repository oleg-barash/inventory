import {
    INVENTORIZATION_LOADING,
    INVENTORIZATION_LOADED,
    OPEN_IMPORT_DIALOG,
    CLOSE_IMPORT_DIALOG,
    INVENTORIZATION_LIST_LOADING,
    INVENTORIZATION_LIST_LOADED,
    INVENTORIZATION_SAVING,
    INVENTORIZATION_SAVED,
    VALIDATE_INVENTORIZATION,
    HIDE_INVENTORIZATION_LOADING,
    START_RESTS_IMPORT,
    STOP_RESTS_IMPORT,
    VALIDATE_RESTS_DATA,
    RESTS_DATA_VALIDATED,
    PARSE_RESTS_DATA,
    RESTS_DATA_IMPORTED
} from '../constants/actionTypes';

const def = { isLoading: false, isListLoading: false, isImportDialogOpened: false, importInProgress: false }
export default function inventorization(state = def, action) {

    switch (action.type) {
        case INVENTORIZATION_LOADING:
        case INVENTORIZATION_SAVING:
            return Object.assign({}, state, { isLoading: true })
        case INVENTORIZATION_SAVED:
            return Object.assign({}, state, { isLoading: false, list: _.map(state.list, item =>{ item.Id == action.inventorization.Id ? action.inventorization : item}) })
        case INVENTORIZATION_LOADED:
            return Object.assign({}, state, { isLoading: false, inventorization: action.inventorization })
        case HIDE_INVENTORIZATION_LOADING:
            return Object.assign({}, state, { isLoading: false })
        case VALIDATE_INVENTORIZATION:
            action.inventorization.NameError = !!action.inventorization.Name ? '' : 'Укажите название инвентаризации';
            let inventorization = Object.assign({}, state.inventorization, action.inventorization);
            return Object.assign({}, state, { isLoading: false, inventorization })
        case INVENTORIZATION_LIST_LOADING:
            return Object.assign({}, state, { isListLoading: true })
        case INVENTORIZATION_LIST_LOADED:
            return Object.assign({}, state, { isListLoading: false, list: action.list })
        case OPEN_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: true })
        case CLOSE_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: false })
        case START_RESTS_IMPORT:
            return Object.assign({}, state, {
                importInProgress: true
            })
        case STOP_RESTS_IMPORT:
            return Object.assign({}, state, {
                importInProgress: false
            })
        case PARSE_RESTS_DATA:
            let rows = action.data.split("\n");
            let itemsToUpload = rows.map((row) => {
                let columns = row.split(",")
                return {
                    BarCode: columns[0],
                    Count: columns[1],
                    Price: columns[2],

                }
            });
            return Object.assign({}, state, { dataForImport: itemsToUpload })
        case RESTS_DATA_IMPORTED:
            return Object.assign({}, state, { dataForImport: undefined, importInProgress: false })
        default: return state
    }
}