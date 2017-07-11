import { REPORT_LOAD_INV3, REPORT_LOAD_IN_PROCESS, REPORT_LOAD_FINISHED } from '../constants/actionTypes'
export default function RreportReducers(state = { BuildInProcess: false }, action){
    switch(action.type){
        case REPORT_LOAD_IN_PROCESS:
            return Object.assign({}, state, { BuildInProcess: true });
        case REPORT_LOAD_FINISHED:
            return Object.assign({}, state, { BuildInProcess: false });
        default: return state;
    }
}