import { VALIDATE_USER, SET_CURRENT_USER } from '../constants/actionTypes'

export default function user(state = { Type: 0 }, action)
{
    switch (action.type){
        case VALIDATE_USER:
            let actionItem = Object.assign({}, state, action.data)
            return actionItem;
        case SET_CURRENT_USER:
            return action.user;
        default:
            return state
    }
}