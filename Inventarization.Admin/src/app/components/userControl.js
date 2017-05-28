import React, { PropTypes, Component  } from 'react';
import { connect } from 'react-redux'
import LoginButton from './loginButton';
import LoggedButton from './loggedButton';
import AuthorizedComponent from '../components/authorizedComponent'
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}
class UserControl extends AuthorizedComponent{
    constructor(props) {
        debugger
        super(props);
    }
    render(){
        let { userInfo } = this.props;
        if (userInfo && userInfo.IsAuthorized === true){ 
            return(<LoggedButton/>);
        }
        return(<LoginButton/>);
    }
}

export default connect(mapStateToProps)(UserControl)