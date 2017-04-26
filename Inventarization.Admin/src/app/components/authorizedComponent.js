import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash';
 
class AuthorizedComponent extends Component {

  componentWillMount() {
    // const { routes } = this.props; // array of routes
 
    // // check if user data available
    // const user = JSON.parse(localStorage.getItem('user'));
    // if (!user) {
    //   // redirect to login if not
    //   this.props.router.push('/login');
    //   return null;
    // }
    // // get all roles available for this route
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

export default AuthorizedComponent