import AuthorizedComponent from '../authorizedComponent'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';


import {
    fetchUsers,
    assignUser,
    deassignUser
} from '../../actions/userActions'

const paperStyle = {
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    display: 'inline-block',
};


class UserList extends AuthorizedComponent {
    componentDidMount() {
        let { dispatch, userInfo, users } = this.props;
        if (!users) {
            dispatch(fetchUsers(userInfo.Token))
        }

    }
    render() {
        let { id, dispatch, users, userInfo } = this.props;
        let toggleUser = function(user, isChecked){
            if (isChecked){
                user.Inventorization = id;
                dispatch(assignUser(user.Id, id, userInfo.Token))
            }
            else{
                delete user.Inventorization;
                dispatch(deassignUser(user, userInfo.Token))
            }
        }

        return (<Paper style={paperStyle} zDepth={3} rounded={false} >
            Здесь можно назначить пользователей на инвентаризацию
                        <List>{users != undefined ? _.sortBy(users, x => x.Inventorization != id).map(x => 
                            {
                                return <ListItem key={x.Id} id={x} leftCheckbox={<Checkbox checked={x.Inventorization == id} onCheck={function(ev, val){toggleUser(x, val)}} />} primaryText={x.Login} />
                            })
                         : null}</List>
        </Paper>)
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        users: state.users.list
    }
}

UserList.propTypes = {
    id: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(UserList)