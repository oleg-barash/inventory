import { VALIDATE_ACTION, SET_CURRENT_ACTION, ACTION_SAVED } from '../constants/actionTypes'

export function action(state = { Type: 0 }, action)
{
    switch (action.type){
        case VALIDATE_ACTION:
            let actionItem = Object.assign({}, state, action.data)
            if (actionItem.Type != 2){
                actionItem.NameError = actionItem.Name !== '' && actionItem.Name !=='Не найдена в номенклатуре' ? '' : 'Наименование товара нужно выбрать из списка'
                actionItem.BarCodeError = actionItem.BarCode !== '' && actionItem.BarCode !== undefined ? '' : 'Код товара нужно выбрать из списка'
            }
            actionItem.QuantityError = actionItem.Quantity !== '' ? '' : 'Количество нужно обязательно указать'
            actionItem.ZoneError = actionItem.Zone !== undefined ? '' : 'Зону нужно обязательно указать'
            if (!actionItem.Id){
                if (actionItem.Zone){
                    if (actionItem.Zone.ClosedAt === ''){
                        actionItem.ZoneError = 'Зона закрыта. Для добавления действия в эту зону её нужно открыть'
                    }
                    if (actionItem.Zone.OpenedAt === ''){
                        actionItem.ZoneError = 'Зона не была открыта. Сначала откройте зону.'
                    }
                }
            }
            return Object.assign({}, state, actionItem);
        case SET_CURRENT_ACTION:
            return Object.assign({}, state,  action.action);
        case ACTION_SAVED:
            return Object.assign({}, state, action.action);
        default:
            return state
    }
}