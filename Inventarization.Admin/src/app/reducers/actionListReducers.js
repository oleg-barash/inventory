/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ACTION, REQUEST_ACTION, RECEIVE_ACTION, DELETING_ACTION, ACTION_DELETED, SHOW_LOADING, HIDE_LOADING } from '../constants/actionTypes'

export function actionList(state = { isFetching: false, items: [], filter: {}, action: {} }, action)
{
    switch (action.type){
        case ACTION_DELETED:
            return Object.assign({}, state, {
                isFetching: false,
                items: state.items.filter((actionItem) => actionItem.Id !== action.id)
            })
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
        case FILTER_ACTION:
            var filter = Object.assign(state.filter, action.filter)
            return Object.assign({}, state, { filter })
        case REQUEST_ACTION:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ACTION:
            var items = action.items
            if (action.filter !== undefined){
                if (action.filter.Code !== undefined){
                    items = items.filter((item) => {
                        return item.BarCode.startsWith(action.filter.Code);
                    })
                }
            }
            return Object.assign({}, state, {
                    isFetching: false,
                    items: action.items.map(x => {
                        x.key = x.Id;
                        return x;
                    }),
                    lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}