import React, { PropTypes, Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/Content/create';
import { deleteUser } from '../../actions/userActions'
import { green200 as green } from 'material-ui/styles/colors';
import { red200 as red } from 'material-ui/styles/colors';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { List, ListItem } from 'material-ui/List';

class UserRow extends Component {
    render() {
        let { user, userInfo, dispatch } = this.props;
        let deleteFunc = function () {
            dispatch(deleteUser(user, userInfo.Token))
        }

        let editUser = function () {
            browserHistory.push('/editUser?id=' + user.Id);
        }
        return (<ListItem key={user.Id} primaryText={user.FamilyName + ' ' + user.FirstName + ' (' + user.Login + ')'}
            onTouchTap={editUser}
            rightIcon={<IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
                <MenuItem hoverColor={green} primaryText="Редактировать" onClick={editUser} rightIcon={<Edit />} />
                <MenuItem hoverColor={red} primaryText="Удалить" onClick={deleteFunc} rightIcon={<DeleteAndroid />} />
            </IconMenu>}>

        </ListItem>);
    }
}

UserRow.propTypes = {
    user: PropTypes.shape(
        {
            Login: PropTypes.string
        }
    )
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(UserRow)