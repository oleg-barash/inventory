import { COMPANY_LOADING, COMPANY_LOADED, COMPANY_LIST_LOADING, COMPANY_LIST_LOADED, COMPANY_SAVING, COMPANY_SAVED, VALIDATE_COMPANY, HIDE_COMPANY_LOADING } from '../constants/actionTypes';

export default function company(state = { isLoading: false, isListLoading: false }, action) {
    switch (action.type) {
        case COMPANY_LOADING:
        case COMPANY_SAVING:
        case COMPANY_SAVED:
            return Object.assign({}, state, { isLoading: true })
        case COMPANY_LOADED:
            return Object.assign({}, state, { isLoading: false, company: action.company })
        case HIDE_COMPANY_LOADING:
            return Object.assign({}, state, { isLoading: false })
        case VALIDATE_COMPANY:
            action.company.NameError = !!action.company.Name ? '' : 'Укажите название компании';
            let company = Object.assign({}, state.company, action.company);
            return Object.assign({}, state, { isLoading: false, company })
        case COMPANY_LIST_LOADING:
            return Object.assign({}, state, { isListLoading: true })
        case COMPANY_LIST_LOADED:        
            return Object.assign({}, state, { isListLoading: false, list: action.list })
        default: return state
    }
}