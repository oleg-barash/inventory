import { TableRow, TableRowColumn } from 'material-ui/Table'
import React, { PropTypes, Component } from 'react';
class UserRow extends Component{
    render(){
        return (<TableRow>
                    <TableRowColumn style={{width: '100px'}}>{this.props.user.Login}</TableRowColumn>
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

export default UserRow;