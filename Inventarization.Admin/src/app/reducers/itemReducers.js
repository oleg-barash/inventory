/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS } from '../constants/actionTypes'
export function itemList(state = { isFetching: false, items: [], filter: {} }, action)
{
    switch (action.type){
        case REQUEST_ITEMS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ITEMS:
                var items = action.items
                if (action.filter !== undefined){
                    items = items.filter((item) => {
                        return item.BarCode.startsWith(action.filter.Code);
                    })
                }
            return Object.assign({}, state, {
                isFetching: false,
                items: items.map(x => {
                    x.key = x.Id;
                    return x;
                }),
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}