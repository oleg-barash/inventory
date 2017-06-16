import AuthorizedComponent from './authorizedComponent'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import UserRow from './userRow';
import React, { PropTypes, Component } from 'react';
class UserList extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let { users } = this.props;
        return (<Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Имя пользователя</TableHeaderColumn>
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
        </Table>);
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