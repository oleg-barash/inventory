/**
 * Created by Барашики on 27.03.2017.
 */
import { 
    RECEIVE_DICTIONARY,
    REQUEST_DICTIONARY,
    LOAD_MORE_DICTIONARY_ITEMS,
    UPDATE_DICTIONARY_ITEMS_FILTER,
    SET_DICTIONARY_ITEMS_LOADING,
    FILTER_DICTIONARY_ITEMS,
    SHOW_DICTIONARY_LOADING,
    HIDE_DICTIONARY_LOADING
} from '../constants/actionTypes'
import _ from 'lodash'

function _applyFilter(items, filter){
            var result = items,
                counter = 0;
            if (filter.text !== undefined && filter.text.length > 4){
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

export default function dictionary(state = { isFetching: false, items: [], displayItems:[], filter: { currentPage : 1, pageSize : 100, text: undefined, type: undefined } }, action)
{
    switch (action.type){
        case FILTER_DICTIONARY_ITEMS:
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(state.items, filter)
            return Object.assign({}, state, {isFetching: false, filter: filter, displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })} )
        case REQUEST_DICTIONARY:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_DICTIONARY:
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

        case UPDATE_DICTIONARY_ITEMS_FILTER:
            return Object.assign({}, state, { isFetching: true, filter: Object.assign({}, state.filter, action.filter) })
        default:
            return state
    }
}