/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS } from '../constants/actionTypes'
export function itemList(state = { isFetching: false, items: [], filter: {} }, action)
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
        default:
            return state
    }
}