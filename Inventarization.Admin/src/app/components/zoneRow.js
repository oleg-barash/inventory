/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import {red700 as red}  from 'material-ui/styles/colors';
import {fullWhite as white}  from 'material-ui/styles/colors';
import { openZone } from '../actions/MainActions';
import moment from 'moment';
moment.locale("ru-RU")

class ZoneRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {zone, dispatch} = this.props;

        var openFunc = function () {
            dispatch(openZone(zone))
        }
        return (
            <TableRow>
                <TableRowColumn>{zone.ZoneName}</TableRowColumn>
                <TableRowColumn>{moment(zone.OpenedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn>{moment(zone.ClosedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn >

                    <FlatButton
                        backgroundColor={white}
                        hoverColor={red}
                        icon={<DeleteAndroid/>}
                        onClick={openFunc}
                    />
                    {/*<LinearProgress mode="indeterminate"/>*/}
                </TableRowColumn>
            </TableRow>       
        )
    }
}

ZoneRow.propTypes = {
    zone: PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired,
    }).isRequired
}

export default connect()(ZoneRow)
