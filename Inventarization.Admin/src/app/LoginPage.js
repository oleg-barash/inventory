import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import TextField from 'material-ui/TextField';
import { login as onLogin, loginChanged, passwordChanged, loginFinished, closeInventorizationDialog, openInventorizationDialog } from './actions/authorizationActions'

const paperStyle = {
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    display: 'inline-block',
};
const loginButtonStyle = {
  margin: 12,
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch
    }
}


class LoginPage extends Component {
   componentWillMount() {
     const { cookies } = this.props;
     const user = cookies.get('credentials');
     if (user){
       if (user.IsAuthorized === true){
        if (user.SelectedInventorization){
          this.props.dispatch(loginFinished(user));
        }
        else{
          this.props.dispatch(openInventorizationDialog());
        }
       }
     }
  }
  render(){
      let { dispatch, userInfo } = this.props;
      let loginHandler = function(){
        dispatch(onLogin(userInfo.login, userInfo.password));
      }

      let loginChangedHandler = function(event, value){
        dispatch(loginChanged(value));
      }

      let passwordChangedHandler = function(event, value){
        dispatch(passwordChanged(value));
      }

      if (!!this.props.userInfo && (this.props.userInfo.IsAuthorized === true)){
        if (this.props.userInfo.SelectedInventorization !== undefined){
          browserHistory.push('/items')
        }
        else if (!this.props.userInfo.isInventorizationDialogOpened){
          dispatch(openInventorizationDialog())
        }
      }

    return (<Paper style={paperStyle} zDepth={3} rounded={false}>
      <h2>Авторизация</h2>
      <TextField
        floatingLabelText="Имя пользователя"
        onChange={loginChangedHandler}
        value={this.props.login}
      /><br />
      <TextField
        errorText={!!this.props.userInfo ? this.props.userInfo.Error : ''}
        floatingLabelText="Пароль"
        onChange={passwordChangedHandler}
        value={this.props.password}
        type="password"
      /><br />
      <RaisedButton label="Войти" onClick={loginHandler} style={loginButtonStyle} />
    </Paper>)
    }
}
export default connect(mapStateToProps)(LoginPage)
