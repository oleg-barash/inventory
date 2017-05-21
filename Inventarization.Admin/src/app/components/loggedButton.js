import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { logout } from '../actions/authorizationActions'
import AuthorizedComponent from '../components/authorizedComponent'
import { connect } from 'react-redux'
import React, { Component } from 'react';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch
    }
}


class LoggedButton extends AuthorizedComponent {
    render(){
        let { dispatch } = this.props;
        let handleChangeItem = function(event, value) {
            debugger
            switch(value){
                case "logoutItem":
                    dispatch(logout());
            }
        };
        return (<IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            onChange={handleChangeItem}>
            <MenuItem value="logoutItem" primaryText="Выход"/>
        </IconMenu>)
    }
};

export default connect(mapStateToProps)(LoggedButton)