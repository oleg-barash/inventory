/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS, OPEN_IMPORT_DIALOG, CLOSE_IMPORT_DIALOG } from '../constants/actionTypes'
export function itemList(state = { isFetching: false, items: [], filter: {}, isImportDialogOpened: false }, action)
{
    switch (action.type){
        case FILTER_ITEMS:
            var filter = Object.assign(state.filter, action.filter)
            return Object.assign({filter}, state)
        case REQUEST_ITEMS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ITEMS:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.items.map(x => {
                    x.key = x.Id;
                    return x;
                }),
                lastUpdated: action.receivedAt
            })
        case OPEN_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: true })
        case CLOSE_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: false })
        default:
            return state
    }
}