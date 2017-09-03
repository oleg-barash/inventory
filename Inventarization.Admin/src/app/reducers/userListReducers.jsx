import { FETCH_USERS, USERS_RECEIVED, USER_DELETED, USER_SAVED } from '../constants/actionTypes'
import _ from 'lodash'
export default function users(state = { isFetching: false }, action) {
    switch (action.type) {
        case FETCH_USERS:
            return Object.assign({}, state, { isFetching: true });
        case USERS_RECEIVED:
            return Object.assign({}, state, { isFetching: false, list: _.sortBy(action.users, x => x.FamilyName + x.FirstName) });
        case USER_DELETED:
            return Object.assign({}, state, { list: _.without(state.list, action.user) });
        case USER_SAVED:
            return Object.assign({}, state, {
                list: state.list.map(x => {
                    if (x.Id === action.user.Id) {
                        return action.user;
                    }
                    return x;
                })
            });
        default: return state;
    }
}