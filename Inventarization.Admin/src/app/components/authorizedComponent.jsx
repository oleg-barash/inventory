import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash';
import { login } from '../actions/authorizationActions'
import { browserHistory } from 'react-router'
import { loginFinished, updateUserInfo } from '../actions/authorizationActions'
import { Cookies } from 'react-cookie';

class AuthorizedComponent extends Component {
  componentWillMount() {
    const { userInfo, dispatch, cookies } = this.props;
      if (userInfo.Token == undefined){
        let cookieUserData = cookies.get("UserData");
        if (cookieUserData == undefined || cookieUserData.Token == undefined){
          if (this.props.router){
            this.props.router.push('/login');
          }
          if (browserHistory){
            browserHistory.push('/login');
          }
          return null;
        }
        else{
          if (userInfo.Token == undefined){
            dispatch(updateUserInfo(cookieUserData))
          }
        }
      }
  }
}
AuthorizedComponent.propTypes = {
    cookies: PropTypes.shape(Cookies).isRequired
}
export default AuthorizedComponent