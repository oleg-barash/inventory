/**
 * Created by Барашики on 27.03.2017.
 */
import {
    FILTER_ACTION,
    REQUEST_ACTION,
    RECEIVE_ACTIONS,
    DELETING_ACTION,
    ACTION_DELETED,
    SHOW_LOADING,
    HIDE_LOADING,
    UPDATE_ACTIONS_FILTER,
    RECEIVE_ZONES,
    ACTION_SAVED
} from '../constants/actionTypes'
import _ from 'lodash'

const filterActions = (items, filter) => {
    if (items == undefined) {
        return [];
    }
    var result = items;
    if (filter !== undefined) {
        if (filter.Zone !== undefined) {
            result = result.filter((item) => {
                return item.Zone === filter.Zone.Id;
            })
        }
        if (!!filter.Code) {
            result = result.filter((item) => {
                return item.BarCode.toUpperCase().startsWith(filter.Code.toUpperCase());
            })
        }
        if (filter.Type != undefined) {
            if (filter.Type != 3) {
                result = result.filter((item) => {
                    return item.Type == filter.Type;
                })
            }
        }
    }
    return result;
}


let getTypes = function (actions) {
    return _.uniq(actions.map(x => { return { id: x.Type, text: getTypeLabel(x.Type) } }, (x, y) => x.id === y.id));
}

export function actionList(state = { isFetching: false, items: [], filter: {}, action: {}, filtredActions: [] }, action) {
    switch (action.type) {
        case ACTION_DELETED:
            var items = state.items.filter((actionItem) => actionItem.Id !== action.action.Id);
            var filtredActions = filterActions(items, state.filter);
            return Object.assign({}, state, { isFetching: false, items, filtredActions })
        case DELETING_ACTION:
            return Object.assign({}, state, {
                isFetching: false,
                items: state.items.map((actionItem) => {
                    if (actionItem.Id === action.id) {
                        actionItem.IsDeleting = true;
                    }
                    return actionItem;
                }),
                lastUpdated: action.receivedAt
            })

        case SHOW_LOADING:
            return Object.assign({}, state, { isFetching: true })
        case HIDE_LOADING:
            return Object.assign({}, state, { isFetching: false })
        case UPDATE_ACTIONS_FILTER:
            var filter = Object.assign(state.filter, action.filter)
            var items = filterActions(state.items, filter)
            return Object.assign({}, state, { filter, filtredActions: items })
        case REQUEST_ACTION:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ACTIONS:
            var items = filterActions(action.items, state.filter)
            return Object.assign({}, state, {
                isFetching: false,
                items: action.items.map(x => {
                    x.key = x.Id;
                    return x;
                }),
                filtredActions: items,
                lastUpdated: action.receivedAt
            })
        // case ACTION_ADDED:
        //     return Object.assign({}, state, {
        //         items: action.items.push(action.action),
        //         filtredActions: items,
        //         lastUpdated: action.receivedAt
        //     })
        // case ACTION_SAVED:
        //     return Object.assign({}, state, {
        //         items: state.items.map((actionItem) => {
        //             if (actionItem.Id === action.action.Id) {
        //                 return Object.assign({}, actionItem, action.action);
        //             }
        //             return actionItem;
        //         })
        //     })
        default:
            return state
    }
}