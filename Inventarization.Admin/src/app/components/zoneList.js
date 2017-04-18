/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ZoneRow from '../components/zoneRow';
const ZoneList = ({ zones }) => (
    <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn>Зона</TableHeaderColumn>
                <TableHeaderColumn>Время открытия</TableHeaderColumn>
                <TableHeaderColumn>Время закрытия</TableHeaderColumn>
                <TableHeaderColumn>Действия</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {zones.map(zone =>
                <ZoneRow zone={zone} key={zone.ZoneStatusId}/>
            )}
        </TableBody>
    </Table>
)


ZoneList.propTypes = {
    zones: PropTypes.arrayOf(PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default ZoneList
