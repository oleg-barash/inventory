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
        super(props);
    }
    render(){
        let { userInfo } = this.props;
        if (userInfo && userInfo.IsAuthorized){ 
            return(<LoggedButton cookies={this.props.cookies}/>);
        }
        return(<LoginButton/>);
    }
}

export default connect(mapStateToProps)(UserControl)