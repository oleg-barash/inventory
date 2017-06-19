import { Link, browserHistory } from 'react-router'
import React, { Component } from 'react';
import { connect } from 'react-redux'
class LoginButton extends Component {
    render(){
        return (<Link to={{pathname: "/login"}}>Вход<br/></Link>)
    }
};

export default connect()(LoginButton)