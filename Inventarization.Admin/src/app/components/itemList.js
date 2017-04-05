/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ItemRow from '../components/itemRow';
const ItemList = ({ items }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHeaderColumn>Код</TableHeaderColumn>
                <TableHeaderColumn>Количество план</TableHeaderColumn>
                <TableHeaderColumn>Количество факт</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map(item =>
                <ItemRow item={item} key={item.BarCode + item.Zone}/>
            )}
        </TableBody>
    </Table>
)

export default ItemList
