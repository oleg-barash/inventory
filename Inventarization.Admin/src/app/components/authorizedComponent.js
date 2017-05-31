import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash';
import { login } from '../actions/authorizationActions'
import { browserHistory } from 'react-router'
import { loginFinished } from '../actions/authorizationActions'
import { Cookies } from 'react-cookie';


class AuthorizedComponent extends Component {
  componentWillMount() {
    const { userInfo, dispatch, cookies } = this.props;
    if (userInfo == undefined || userInfo.IsAuthorized === false){
      if (this.props.router){
        this.props.router.push('/login');
      }
      if (browserHistory){
        browserHistory.push('/login');
      }
      return null;
    }

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