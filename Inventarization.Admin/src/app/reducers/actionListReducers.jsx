/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ACTION, REQUEST_ACTION, RECEIVE_ACTIONS, DELETING_ACTION, ACTION_DELETED, SHOW_LOADING, HIDE_LOADING, UPDATE_ACTIONS_FILTER } from '../constants/actionTypes'

const filterActions = (items, filter) => {
    if (items == undefined){
        return [];
    }
    var result = items;
    if (filter !== undefined){
        if (filter.ZoneName !== undefined){
            result = result.filter((item) => {
                return item.Zone.ZoneName.toUpperCase().startsWith(filter.ZoneName.toUpperCase());
            })
        }
        if (filter.Code !== undefined){
            result = result.filter((item) => {
                return item.BarCode.toUpperCase().startsWith(filter.Code.toUpperCase());
            })
        }
    }
    return result;
}

export function actionList(state = { isFetching: false, items: [], filter: {}, action: {}, filtredActions: [] }, action)
{
    switch (action.type){
        case ACTION_DELETED:
            var items = state.items.filter((actionItem) => actionItem.Id !== action.id);
            var filtredActions = filterActions(items, state.filter);
            return Object.assign({}, state, { isFetching: false, items, filtredActions })
        case DELETING_ACTION:
            return Object.assign({}, state, {
                isFetching: false,
                items: state.items.map((actionItem) => {
                    if (actionItem.Id === action.id)
                    {
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
        default:
            return state
    }
}