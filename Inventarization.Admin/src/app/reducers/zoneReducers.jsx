/**
 * Created by Барашики on 27.03.2017.
 */
import { REQUEST_ZONES, RECEIVE_ZONES, USAGES_LOADED, USAGE_UPDATED } from '../constants/actionTypes'
import _ from 'lodash'
export function zoneList(state = { isFetching: false }, action) {
    switch (action.type) {
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
        case USAGES_LOADED:
            let zones = state.items.map(x => {
                if (action.zone.Id == x.Id) {
                    return Object.assign({}, x, { Usages: action.usages });
                }
                return x;
            });
            return Object.assign({}, state, { items: zones })
        case USAGE_UPDATED:
            var zones = state.items.map(x => {
                if (x.Id === action.usage.ZoneId) {
                    return Object.assign({}, x, { Usages: x.Usages.map(u => u.Type === action.usage.Type ? action.usage : u) });
                }
                return x;
            });
            return Object.assign({}, state, { items: zones })
        default:
            return state
    }
}