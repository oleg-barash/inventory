import AuthorizedComponent from '../authorizedComponent'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import UserRow from './userRow';
import React, { PropTypes, Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/Content/add';
import { green100 as green}  from 'material-ui/styles/colors';
import { browserHistory } from 'react-router'

class UserList extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let { users } = this.props;
        let addFunc = function() {
            browserHistory.push('/newUser');
        }
        return (
        <div>
            <FlatButton hoverColor={green}
                icon={<Add/>}
                onClick={addFunc}
            />
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Имя пользователя</TableHeaderColumn>
                        <TableHeaderColumn>Действия</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map(user =>
                        {
                            return <UserRow user={user} key={user.Login}/>
                        })
                    }
                    
                </TableBody>
            </Table>
        </div>);
    }    
}

UserRow.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape(
        {
            Login: PropTypes.string
        })
    )
};


export default UserList;