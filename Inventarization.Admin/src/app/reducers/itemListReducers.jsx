/**
 * Created by Барашики on 27.03.2017.
 */
import { FILTER_ITEMS, REQUEST_ITEMS, RECEIVE_ITEMS, UPDATE_ITEMS_FILTER  } from '../constants/actionTypes'
import _ from 'lodash'

function _applyFilter(items, filter){
            var result = items,
                counter = 0;
            if (filter.type !== undefined){
                switch(filter.type){
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
            if (filter.text !== undefined && filter.text.length > 4){
                result = _.filter(result, (item) => {
                    let val = filter.text.toUpperCase();
                    return item.BarCode && item.BarCode.toUpperCase().startsWith(val) 
                        || item.Number && item.Number.toUpperCase().startsWith(val) 
                        || item.Name && item.Name.toUpperCase().startsWith(val) 
                        || item.Description && item.Description.toUpperCase().startsWith(val);
                })
            }

            if (filter.zone !== undefined){
                result = _.filter(result, (item) => {
                    let details = item.Actions.reduce( (previousValue, currentValue) => previousValue.concat(currentValue.ZoneDetails), [])
                    return details.some(x => x.Zone === filter.zone.ZoneName);
                })
            }
            if (filter.devation !== undefined){
                let devation = parseInt(filter.devation);
                if (!isNaN(devation)){
                    result = _.filter(result, (item) => {
                        return item.QuantityPlan - item.QuantityFact >= devation
                    });
                }
            }
            if (filter.priceDevation !== undefined){
                let priceDevation = parseInt(filter.priceDevation);
                if (!isNaN(priceDevation)){
                    result = _.filter(result, (item) => {
                        return item.QuantityPlan*item.Price - item.QuantityFact*item.Price >= priceDevation
                    });
                }
            }

            return _.take(result, filter.pageSize * filter.currentPage);
}

export function itemList(state = { isFetching: false, items: [], displayItems:[], filter: { currentPage : 1, pageSize : 100, text: undefined, type: undefined} }, action)
{
    switch (action.type){
        case FILTER_ITEMS:
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(state.items, filter)
            return Object.assign({}, state, {isFetching: false, filter: filter, displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })} )
        case REQUEST_ITEMS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ITEMS:
            var totalPages = Math.floor(action.items.length / state.filter.pageSize);
            var filter = Object.assign({}, state.filter, action.filter);
            var result = _applyFilter(action.items, filter);
            return Object.assign({}, state, {
                isFetching: false,
                totalPages: totalPages,
                items: action.items.map(x => {
                    x.FullName = x.BarCode + '(' + x.Description + ')';
                    return x}),
                lastUpdated: action.receivedAt,
                displayItems: result.map(x => {
                    x.key = x.Id;
                    return x;
                })
            })

        case UPDATE_ITEMS_FILTER:
            return Object.assign({}, state, { isFetching: true, filter: Object.assign({}, state.filter,action.filter) })
        default:
            return state
    }
}