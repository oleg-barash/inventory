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

    // if (document != undefined)
    // {
    //   let userData = JSON.parse(document.cookie);
    //   if (userData == null){
    //     return null;
    //   }
    // }
    // else{
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
    //}

    // get all roles available for this route
    // const routeRoles = _.chain(routes)
    //   .filter(item => item.authorize) // access to custom attribute
    //   .map(item => item.authorize)
    //   .flattenDeep()
    //   .value();
 
    // // compare routes with user data
    // if (_.intersection(routeRoles, user.roles).length === 0) {
    //   router.push('/not-authorized');
    // }
  }
}
AuthorizedComponent.propTypes = {
    cookies: PropTypes.shape(Cookies).isRequired
}
export default AuthorizedComponent