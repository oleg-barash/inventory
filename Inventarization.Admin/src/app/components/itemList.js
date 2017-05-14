/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ItemRow from '../components/itemRow';

const ItemList = ({ items }) => (
    <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn style={{width: '280px'}}>Наименование</TableHeaderColumn>
                <TableHeaderColumn>Номер</TableHeaderColumn>
                <TableHeaderColumn>Код</TableHeaderColumn>
                <TableHeaderColumn>Зоны</TableHeaderColumn>
                <TableHeaderColumn>План</TableHeaderColumn>
                <TableHeaderColumn>Факт</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map(item =>
                <ItemRow item={item} key={item.BarCode}/>
            )}
        </TableBody>
    </Table>
)


ItemList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        BarCode: PropTypes.string.isRequired
    }).isRequired).isRequired,
    filter: PropTypes.object,
}

export default ItemList
