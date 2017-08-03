/**
 * Created by Барашики on 27.03.2017.
 */
import { REQUEST_ZONES, RECEIVE_ZONES } from '../constants/actionTypes'
import _ from 'lodash'
export function zoneList(state = { isFetching: false }, action)
{
    switch (action.type){
        case REQUEST_ZONES:
            return Object.assign({}, state, { isFetching: true })
        case RECEIVE_ZONES:
            return Object.assign({}, state, {
                isFetching: false,
                items: _.sortBy(action.items.map(x => {
                    x.key = x.Id;
                    return x;
                }), x => x.Number),
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}