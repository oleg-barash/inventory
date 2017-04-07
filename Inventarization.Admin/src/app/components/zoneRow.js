/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
moment.locale("ru-RU")
const ZoneRow = ({ zone }) => (
    <TableRow>
        <TableRowColumn>{zone.ZoneName}</TableRowColumn>
        <TableRowColumn>{moment(zone.OpenedAt).format("DD MMMM hh:mm")}</TableRowColumn>
        <TableRowColumn>{moment(zone.ClosedAt).format("DD MMMM hh:mm")}</TableRowColumn>
    </TableRow>
)

ZoneRow.propTypes = {
    zone: PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired,
    }).isRequired
}


export default ZoneRow