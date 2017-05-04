/**
 * Created by Барашики on 27.03.2017.
 */
import { VALIDATE_ITEM, SET_CURRENT_ITEM } from '../constants/actionTypes'

export function item(state = { }, action)
{
    switch (action.type){
        case VALIDATE_ITEM:
            let item = Object.assign({}, state, action.data)
            item.BarCodeError = item.BarCode !== '' ? '' : 'Код товара нужно обязательно указать'
            item.DescriptionError = item.Description !== '' ? '' : 'Наименование товара нужно обязательно указать'
            return item;
        case SET_CURRENT_ITEM:
            return action.item;
            
        default:
            return state
    }
}