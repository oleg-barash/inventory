import { TOGGLE_DRAWER, CLOSE_DRAWER } from "../constants/actionTypes"
export function global(state = { DrawerIsOpened: false  }, action){
    switch(action.type){
        case TOGGLE_DRAWER:
            return Object.assign({}, state, { DrawerIsOpened: !state.DrawerIsOpened });
        case CLOSE_DRAWER:
            return Object.assign({}, state, { DrawerIsOpened: false });
        default: return state;
    }
}