import { FETCH_USERS, USERS_RECEIVED } from '../constants/actionTypes'
export default function users(state = { list: [], isFetching: false}, action){
    switch(action.type) {
        case FETCH_USERS:
            return Object.assign({}, state, { isFetching: true });
        case USERS_RECEIVED:
            return Object.assign({}, state, { isFetching: false, list: action.users });
        default: return state;
    }
}