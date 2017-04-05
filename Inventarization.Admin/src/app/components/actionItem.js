/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
moment.locale("ru-RU")
function getTypeName(type){
    switch(type){
        case 0: return "первое сканирование";
        case 1: return "второе сканирование";
        case 2: return "третье сканирование";
        default: "неизвестно"
    }
}

const ActionRow = ({ action }) => (
    <TableRow>
        <TableRowColumn>{moment(action.DateTime).format("DD MMMM hh:mm")}</TableRowColumn>
        <TableRowColumn>{getTypeName(action.Type)}</TableRowColumn>
        <TableRowColumn>{action.User}</TableRowColumn>
        <TableRowColumn>{action.BarCode}</TableRowColumn>
        <TableRowColumn>{action.Zone}</TableRowColumn>
        <TableRowColumn>{action.Quantity}</TableRowColumn>
    </TableRow>
)

ActionRow.propTypes = {
    action: PropTypes.shape({
        Id: PropTypes.string.isRequired,
    }).isRequired
}


export default ActionRow