import { TableRow, TableRowColumn } from 'material-ui/Table'
import React, { PropTypes, Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/Content/create';
import { deleteUser } from '../../actions/userActions'
import { green200 as green}  from 'material-ui/styles/colors';
import { red200 as red}  from 'material-ui/styles/colors';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
class UserRow extends Component{
    render(){
        let { user, userInfo, dispatch } = this.props;
        let deleteFunc = function(){
            dispatch(deleteUser(user, userInfo.Token))
        }

        let editUser = function() {
            browserHistory.push('/editUser?id=' + user.Id);
        }

        return (<TableRow>
                    <TableRowColumn style={{width: '100px'}}>{user.Login}</TableRowColumn>
                    <TableRowColumn>
                        <FlatButton hoverColor={green}
                            icon={<Edit/>}
                            onClick={editUser}
                        />
                        <FlatButton hoverColor={red}
                            icon={<DeleteAndroid/>}
                            onClick={deleteFunc}
                        />
                    </TableRowColumn>
                </TableRow>);
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