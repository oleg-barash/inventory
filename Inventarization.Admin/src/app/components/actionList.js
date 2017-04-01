/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ActionRow from '../components/actionItem';
const ActionList = ({ actions }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHeaderColumn>Время</TableHeaderColumn>
                <TableHeaderColumn>Тип</TableHeaderColumn>
                <TableHeaderColumn>Пользователь</TableHeaderColumn>
                <TableHeaderColumn>Код</TableHeaderColumn>
                <TableHeaderColumn>Зона</TableHeaderColumn>
                <TableHeaderColumn>Количество</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {actions.map(action =>
                <ActionRow action={action} key={action.Id}/>
            )}
        </TableBody>
    </Table>
)

ActionList.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
            Id: PropTypes.string.isRequired
        }).isRequired).isRequired
}

export default ActionList
