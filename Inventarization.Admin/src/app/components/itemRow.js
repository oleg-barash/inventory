/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
moment.locale("ru-RU")
const ItemRow = ({ item }) => (
    <TableRow>
        <TableRowColumn>{item.BarCode}</TableRowColumn>
        <TableRowColumn>{item.QuantityPlan}</TableRowColumn>
        <TableRowColumn>{item.QuantityFact}</TableRowColumn>
    </TableRow>
)

ItemRow.propTypes = {
    item: PropTypes.shape({
        BarCode: PropTypes.string.isRequired,
    }).isRequired
}


export default ItemRow