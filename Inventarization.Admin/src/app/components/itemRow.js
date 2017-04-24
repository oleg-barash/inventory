/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
moment.locale("ru-RU")
const ItemRow = ({ item }) => (
    <div>
        <TableRow>
            <TableRowColumn>{item.BarCode}</TableRowColumn>
            <TableRowColumn>{item.QuantityPlan}</TableRowColumn>
            <TableRowColumn>{item.QuantityFact}</TableRowColumn>
        </TableRow>
        <TableRow>
        {item.Actions.map(action =>
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn >Зона</TableHeaderColumn>
                        <TableHeaderColumn >Количество</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    <TableRow>       
                        <TableRowColumn>{action.Zone}</TableRowColumn>
                        <TableRowColumn>{action.Quantity}</TableRowColumn>
                    </TableRow>     
                </TableBody>
            </Table>  
        )}
        </TableRow>
    </div>
)

ItemRow.propTypes = {
    item: PropTypes.shape({
        BarCode: PropTypes.string.isRequired,
    }).isRequired
}


export default ItemRow