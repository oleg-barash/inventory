/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ActionRow from '../components/actionItem';
class ActionList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var {actions, dispatch} = this.props;
        return (
            <div>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn >Время</TableHeaderColumn>
                            <TableHeaderColumn >Тип</TableHeaderColumn>
                            <TableHeaderColumn >Пользователь</TableHeaderColumn>
                            <TableHeaderColumn >Код</TableHeaderColumn>
                            <TableHeaderColumn >Зона</TableHeaderColumn>
                            <TableHeaderColumn >Количество</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '30px'}}></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {actions.map(action => <ActionRow dispatch={dispatch} action={action} key={action.Id}/>)}
                    </TableBody>
                </Table>
            </div>)
    }
}

ActionList.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
            Id: PropTypes.string.isRequired
        }).isRequired).isRequired
}

export default ActionList
