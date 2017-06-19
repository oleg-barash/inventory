import { FETCH_USERS, USERS_RECEIVED, USER_DELETED } from '../constants/actionTypes'
import _ from 'lodash'
export default function users(state = { list: [], isFetching: false}, action){
    switch(action.type) {
        case FETCH_USERS:
            return Object.assign({}, state, { isFetching: true });
        case USERS_RECEIVED:
            return Object.assign({}, state, { isFetching: false, list: action.users });
        case USER_DELETED:
            return Object.assign({}, state, { list: _.without(state.list, action.user) });
        default: return state;
    }
}