/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ACTION, REQUEST_ACTION, RECEIVE_ACTION } from '../constants/actionTypes'
export function actionList(state = { isFetching: false, items: [] }, action)
{
    switch (action.type){
        case FILTER_ACTION:
            return state.items.filter((actionItem) => {
                return actionItem.Id === action.Id;
            })
        case REQUEST_ACTION:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ACTION:
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