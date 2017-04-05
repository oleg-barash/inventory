/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS } from '../constants/actionTypes'
export function itemList(state = { isFetching: false, items: [] }, action)
{
    switch (action.type){
        case FILTER_ITEMS:
            return state.items.filter((item) => {
                return item.Code === action.Code;
            })
        case REQUEST_ITEMS:
            return Object.assign({}, state.items, {
                isFetching: true
            })
        case RECEIVE_ITEMS:
            return Object.assign({}, state.items, {
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