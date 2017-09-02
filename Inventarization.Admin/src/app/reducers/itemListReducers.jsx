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
                result = _.filter(result, (item) => item.Actions !== undefined && item.Fact < item.Count);
                break
            case '2':
                result = _.filter(result, (item) => item.Actions !== undefined && item.Fact > item.Count)
                break
            default:
                break
        }

    }
    if (filter.text !== undefined && filter.text.length > 4) {
        result = _.filter(result, (item) => {
            let val = filter.text.toUpperCase();
            return item.Code && item.Code.toUpperCase().startsWith(val)
                || item.Number && item.Number.toUpperCase().startsWith(val)
                || item.Name && item.Name.toUpperCase().startsWith(val)
                || item.Description && item.Description.toUpperCase().startsWith(val);
        })
    }

    if (filter.zone !== undefined) {
        result = _.filter(result, (item) => {
            let details = item.Actions != undefined ? item.Actions.reduce((previousValue, currentValue) => previousValue.concat(currentValue.Zone), []) : [];
            return details.some(x => x.ZoneName === filter.zone.ZoneName);
        })
    }
    if (filter.devation !== undefined) {
        let devation = parseInt(filter.devation);
        if (!isNaN(devation)) {
            result = _.filter(result, (item) => {
                return item.Count - item.Fact >= devation
            });
        }
    }
    if (filter.priceDevation !== undefined) {
        let priceDevation = parseInt(filter.priceDevation);
        if (!isNaN(priceDevation)) {
            result = _.filter(result, (item) => {
                return item.Count != undefined && item.Price != undefined && (item.Count * item.Price - item.Fact * item.Price >= priceDevation)
            });
        }
    }

    return _.take(result, filter.pageSize * filter.currentPage);
}

export function itemList(state = { isFetching: false, filter: { currentPage: 1, pageSize: 100, text: undefined, type: undefined } }, action) {
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
            let joinedItems = _.unionBy(state.items, action.items, item => item.Code);
            var result = _applyFilter(joinedItems, state.filter).map(x => {
                x.key = x.Id;
                return x;
            });
            return Object.assign({}, state, { items: joinedItems, displayItems: result });
        case UPDATE_ITEMS_FILTER:
            return Object.assign({}, state, { isFetching: true, filter: Object.assign({}, state.filter, action.filter) })
        case RECEIVE_RESTS:
            var itemsWithRests = _.map(action.items, rest => {
                let restItem = _.find(state.items, item => rest.Code === item.Code);
                if (restItem) {
                    return Object.assign({}, restItem, rest)
                }
                return rest;
            });

            var allItems = _.unionBy(itemsWithRests, state.items, x => x.Code);
            return Object.assign({}, state, { isFetching: false, items: allItems, displayItems: _applyFilter(allItems, state.filter) });

        case RECEIVE_ACTIONS:
            var grouppedActions = _.groupBy(action.items, a => a.BarCode);
            var itemsWithActions = _.map(grouppedActions, (values, key) => {
                let item = _.find(state.items, item  => key === item.Code);
                if (item) {
                    return Object.assign(item, { Actions: values })
                }
                return { Code: key, Actions: values, Fact: _.sumBy(values, value => value.Quantity) };
            });
            var allItems = _.unionBy(state.items, itemsWithActions, x => x.Code);
            return Object.assign({}, state, { isFetching: false, items: allItems, displayItems: _applyFilter(allItems, state.filter) });
        case ACTION_DELETED:
            let newItems = state.items.map((item) => Object.assign({}, item, { Actions: _.filter(item.Actions, itemAction => itemAction.Id !== action.action.Id) }));
            return Object.assign({}, state, { isFetching: false, items: newItems });
        default:
    return state;
}
}