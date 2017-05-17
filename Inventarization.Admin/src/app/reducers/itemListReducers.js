/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS, OPEN_IMPORT_DIALOG, CLOSE_IMPORT_DIALOG, UPDATE_ITEMS_FILTER, START_IMPORT, STOP_IMPORT  } from '../constants/actionTypes'
import _ from 'lodash'

function _applyFilter(items, filter){
            var result = items,
                counter = 0;
            if (filter.type !== undefined){
                switch(filter.type){
                    case '1': 
                        result = _.filter(result, (item) => item.QuantityFact < item.QuantityPlan)
                        break
                    case '2': 
                        result = _.filter(result, (item) => item.QuantityFact > item.QuantityPlan)
                        break
                    default:
                        break
                }

            }
            if (filter.text !== undefined){
                result = _.filter(result, (item) => {
                    let val = filter.text.toUpperCase();
                    return item.BarCode && item.BarCode.toUpperCase().startsWith(val) 
                        || item.Number && item.Number.toUpperCase().startsWith(val) 
                        || item.Name && item.Name.toUpperCase().startsWith(val) 
                        || item.Description && item.Description.toUpperCase().startsWith(val);
                })
            }

            return _.take(result, filter.pageSize * filter.currentPage);
}

export function itemList(state = { isFetching: false, items: [], displayItems:[], filter: { currentPage : 1, pageSize : 100, text: undefined, type: undefined}, isImportDialogOpened: false }, action)
{
    switch (action.type){
        case FILTER_ITEMS:
            debugger;
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(state.items, filter)
            return Object.assign({}, state, {isFetching: false, filter: filter, displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })} )
        case REQUEST_ITEMS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case START_IMPORT:
            return Object.assign({}, state, {
                importInProgress: true
            })
        case STOP_IMPORT:
            return Object.assign({}, state, {
                importInProgress: false
            })
        case RECEIVE_ITEMS:
            var totalPages = Math.floor(action.items.length / state.filter.pageSize);
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(action.items, filter);
            return Object.assign({}, state, {
                isFetching: false,
                totalPages: totalPages,
                items: action.items.map(x => {
                    x.FullName = x.BarCode + '(' + x.Description + ')';
                    return x}),
                lastUpdated: action.receivedAt,
                displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })
            })
        case OPEN_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: true })
        case CLOSE_IMPORT_DIALOG:
            return Object.assign({}, state, { isImportDialogOpened: false })
        case UPDATE_ITEMS_FILTER:
            return Object.assign({}, state, { isFetching: true, filter: Object.assign({}, state.filter,action.filter) })
        default:
            return state
    }
}