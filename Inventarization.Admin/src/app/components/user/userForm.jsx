import React, { PropTypes, Component } from 'react';
import { green100 as green } from 'material-ui/styles/colors';
import { yellow100 as yellow } from 'material-ui/styles/colors';
import { red100 as red } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import { saveUser, validateUser, loadUser, setCurrentUser } from '../../actions/userActions'
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        user: state.user
    }
}

class UserForm extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let { dispatch, userInfo, user } = this.props
        let { id } = this.props.location.query;
        if (id !== undefined) {
            if ((user == undefined || user.Id != id)){
                dispatch(loadUser(id, userInfo.Token));
            }
        }
        else if (user != undefined){
            dispatch(setCurrentUser({}));
        }
    }

    render() {
        let { dispatch, userInfo, user } = this.props;
        let goBack = function () {
            browserHistory.goBack();
        }

        let onLoginChange = function (target, value) {
            dispatch(validateUser({ Login: value }));
        }

        let onFirstNameChange = function (target, value) {
            dispatch(validateUser({ FirstName: value }));
        }

        let onFamilyNameChange = function (target, value) {
            dispatch(validateUser({ FamilyName: value }));
        }

        let onPasswordChange = function (target, value) {
            dispatch(validateUser({ Password: value }));
        }

        let onRetypedPasswordChange = function (target, value) {
            dispatch(validateUser({ RetypedPassword: value }));
        }

        let save = function () {
            if (!!user.Login) {
                dispatch(saveUser(user, userInfo.Token));
            }
            else {
                dispatch(validateUser({ Login: user.Login || '' }));
            }
        }
        return (
            <Paper>
                <TextField id="Login" value={user.Login || ''} onChange={onLoginChange} floatingLabelText="Логин пользователя" errorText={user != null ? user.LoginError || '' : ''} />
                <br/>
                <TextField id="FirstName" value={user.FirstName || ''} onChange={onFirstNameChange} floatingLabelText="Имя пользователя" errorText={user != null ? user.FirstNameError || '' : ''} />
                <br/>
                <TextField id="LastName" value={user.FamilyName || ''} onChange={onFamilyNameChange} floatingLabelText="Фамилия пользователя" errorText={user != null ? user.FamilyNameError || '' : ''} />
                <br/>
                <TextField id="Password" type="password" value={user.Password || ''} onChange={onPasswordChange} floatingLabelText="Пароль пользователя" errorText={user != null ? user.PasswordError || '' : ''} />
                <br/>
                <TextField id="RetypedPassword" type="password" value={user.RetypedPassword || ''} onChange={onRetypedPasswordChange} floatingLabelText="Повторите пароль" errorText={user != null ? user.RetypedPasswordError || '' : ''} />
                <br/>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton label="Сохранить" onClick={save} disabled={user.HasError()} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(UserForm)