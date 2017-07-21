/**
 * Created by Барашики on 27.03.2017.
 */
import { REQUEST_RESTS, RECEIVE_RESTS  } from '../constants/actionTypes'

export default function rests(state = { isFetching: false, items: [] }, action)
{
    switch (action.type){
        case RECEIVE_RESTS:
            return Object.assign({}, state, { isFetching: false, items: action.items } )
        case REQUEST_RESTS:
            return Object.assign({}, state, { isFetching: true })
        default:
            return state
    }
}