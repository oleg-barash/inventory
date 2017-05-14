/**
 * Created by Барашики on 27.03.2017.
 */
import { VALIDATE_ACTION, SET_CURRENT_ACTION } from '../constants/actionTypes'

export function action(state = { Type: 0 }, action)
{
    switch (action.type){
        case VALIDATE_ACTION:
        debugger
            let actionItem = Object.assign({}, state, action.data)
            actionItem.NameError = actionItem.Name !== '' ? '' : 'Наименование товара нужно выбрать из списка'
            actionItem.CodeError = actionItem.Code !== '' ? '' : 'Код товара нужно выбрать из списка'
            actionItem.QuantityError = actionItem.Quantity !== '' ? '' : 'Количество нужно обязательно указать'
            actionItem.ZoneError = actionItem.Zone !== undefined ? '' : 'Зону нужно обязательно указать'
            debugger;
            if (actionItem.Zone && !!actionItem.Zone.ClosedAt){
                actionItem.ZoneError = 'Зона закрыта. Для добавления действия в эту зону её нужно открыть'
            }
            return actionItem;
        case SET_CURRENT_ACTION:
            return action.action;
            
        default:
            return state
    }
}