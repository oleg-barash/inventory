/**
 * Created by Барашики on 27.03.2017.
 */
import {
    FILTER_ITEMS,
    UPDATE_ITEMS_FILTER,
    RECEIVE_DICTIONARY,
    RECEIVE_RESTS,
    RECEIVE_ACTIONS,
    ACTION_DELETED
} from '../constants/actionTypes'
import _ from 'lodash'

function _applyFilter(items, filter) {
    var result = items,
        counter = 0;
    result = _.filter(result, (item) => !!item.Count || item.Actions && item.Actions.length > 0)
    if (filter.type !== undefined) {
        switch (filter.type) {
            case '1':
                result = _.filter(result, (item) => item.QuantityFact < item.QuantityPlan)
                break
            case '2':
                result = _.filter(result, (item) => item.QuantityFact > item.QuantityPlan)
                break
            default:
                break
        }

    }
    if (filter.text !== undefined && filter.text.length > 4) {
        result = _.filter(result, (item) => {
            let val = filter.text.toUpperCase();
            return item.BarCode && item.BarCode.toUpperCase().startsWith(val)
                || item.Number && item.Number.toUpperCase().startsWith(val)
                || item.Name && item.Name.toUpperCase().startsWith(val)
                || item.Description && item.Description.toUpperCase().startsWith(val);
        })
    }

    if (filter.zone !== undefined) {
        result = _.filter(result, (item) => {
            let details = item.Actions.reduce((previousValue, currentValue) => previousValue.concat(currentValue.ZoneDetails), [])
            return details.some(x => x.Zone === filter.zone.ZoneName);
        })
    }
    if (filter.devation !== undefined) {
        let devation = parseInt(filter.devation);
        if (!isNaN(devation)) {
            result = _.filter(result, (item) => {
                return item.QuantityPlan - item.QuantityFact >= devation
            });
        }
    }
    if (filter.priceDevation !== undefined) {
        let priceDevation = parseInt(filter.priceDevation);
        if (!isNaN(priceDevation)) {
            result = _.filter(result, (item) => {
                return item.QuantityPlan * item.Price - item.QuantityFact * item.Price >= priceDevation
            });
        }
    }

    return _.take(result, filter.pageSize * filter.currentPage);
}

export function itemList(state = { isFetching: false, items: [], displayItems: [], filter: { currentPage: 1, pageSize: 100, text: undefined, type: undefined } }, action) {
    switch (action.type) {
        case FILTER_ITEMS:
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(state.items, filter)
            return Object.assign({}, state, {
                isFetching: false, filter: filter, displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })
            })
        case RECEIVE_DICTIONARY:
            var result = _applyFilter(action.items, state.filter).map(x => {
                x.key = x.Id;
                return x;
            });
            return Object.assign({}, state, { items: action.items, displayItems: result });
        case UPDATE_ITEMS_FILTER:
            return Object.assign({}, state, { isFetching: true, filter: Object.assign({}, state.filter, action.filter) })
        case RECEIVE_RESTS:
            let rests = action.items;
            let items = _.map(state.items, item => {
                let itemRest = _.find(rests, rest => rest.Code === item.Code);
                if (itemRest) {
                    return Object.assign(item, { Count: itemRest.Count, Price: itemRest.Price })
                }
                return item;
            });
            return Object.assign({}, state, { isFetching: false, items: items, displayItems: _applyFilter(items, state.filter) });

        case RECEIVE_ACTIONS:
            var actions = action.items;
            let updatedItems = _.map(state.items, item => {
                let itemActions = _.filter(actions, action => action.BarCode === item.Code);
                if (itemActions) {
                    return Object.assign(item, { Actions: itemActions })
                }
                return item;
            });
            return Object.assign({}, state, { isFetching: false, items: updatedItems, displayItems: _applyFilter(updatedItems, state.filter) });
        case ACTION_DELETED:
            var items = state.items.filter((actionItem) => actionItem.Id !== action.id);
            var filtredActions = filterActions(items, state.filter);
            return Object.assign({}, state, { isFetching: false, items, filtredActions })
        default:
            return state
    }
}