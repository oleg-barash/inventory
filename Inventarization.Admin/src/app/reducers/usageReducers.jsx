/**
 * Created by Барашики on 27.03.2017.
 */
import { REQUEST_USAGES, RECEIVE_USAGES, RECEIVE_ACTIONS } from '../constants/actionTypes'
import _ from 'lodash'
export function zoneList(state = { isFetching: false }, action) {
    switch (action.type) {
        case REQUEST_USAGES:
            return Object.assign({}, state, { isFetching: true })
        case RECEIVE_USAGES:
            return Object.assign({}, state, {
                isFetching: false,
                items: _.sortBy(action.items.map(x => {
                    x.key = x.Id;
                    return x;
                }), x => x.Number),
                lastUpdated: action.receivedAt
            })
        case RECEIVE_ACTIONS:
            let actions = action.items;
            return Object.assign({}, state, {
                items: state.items.map(x => Object.assign({}, x, { Actions: actions.filter(a => a.Zone === x.ZoneId && a.Type === x.Type) }))
            })
        default:
            return state
    }
}