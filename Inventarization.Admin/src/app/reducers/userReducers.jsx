import { VALIDATE_USER, SET_CURRENT_USER } from '../constants/actionTypes'

let hasError = function (){
    return this.LoginError || this.FirstNameError || this.LastNameError || this.PasswordError || this.RetypedPasswordError;
}

export default function user(state = { Type: 0, HasError: hasError }, action)
{
    switch (action.type){
        case VALIDATE_USER:
            let userItem = Object.assign({}, state, action.data);
            userItem.LoginError = userItem.Login !== '' ? '' : 'Обязательно укажите логин';
            userItem.FirstNameError = userItem.FirstName !== '' ? '' : 'Укажите имя пользователя';
            if (userItem.RetypedPassword !== undefined){
                if (userItem.RetypedPassword === ''){
                    userItem.RetypedPasswordError = 'Повторите пароль';
                }
                else{
                    userItem.RetypedPasswordError = userItem.RetypedPassword === userItem.Password? '' : 'Пароли не совпадают';
                }
            }
            return userItem;
        case SET_CURRENT_USER:
            debugger
            return Object.assign({ HasError: hasError }, action.user);
        default:
            return state
    }
}