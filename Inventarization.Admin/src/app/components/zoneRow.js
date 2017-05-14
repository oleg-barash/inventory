/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Replay from 'material-ui/svg-icons/av/replay';
import Done from 'material-ui/svg-icons/action/done';
import {blue200 as blue}  from 'material-ui/styles/colors';
import {green200 as green}  from 'material-ui/styles/colors';
import {red200 as red}  from 'material-ui/styles/colors';
import {fullWhite as white}  from 'material-ui/styles/colors';
import { openZone, closeZone } from '../actions/zoneActions';
import { setCurrentAction } from '../actions/actionActions';
import Add from 'material-ui/svg-icons/Content/add';
import { browserHistory } from 'react-router'
import moment from 'moment';
moment.locale("ru-RU")

class ZoneRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {zone, dispatch} = this.props;

        let openFunc = function () {
            dispatch(openZone(zone))
        }

        let closeFunc = function () {
            dispatch(closeZone(zone))
        }

        let newAction = function() {
            dispatch(setCurrentAction({Zone: zone, Type: 0}))
            browserHistory.push('/newAction');
        }

        return (
            <TableRow>
                <TableRowColumn>{zone.ZoneName}</TableRowColumn>
                <TableRowColumn>{moment(zone.OpenedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn>{zone.ClosedAt == undefined ? "не закрыта" : moment(zone.ClosedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn >
                    <FlatButton disabled={zone.ClosedAt != undefined}
                        hoverColor={blue}
                        icon={<Add/>}
                        onClick={newAction}
                    />
                    <FlatButton disabled={zone.ClosedAt == undefined}
                        backgroundColor={white}
                        hoverColor={red}
                        icon={<Replay/>}
                        onClick={openFunc}
                    />
                    <FlatButton disabled={zone.ClosedAt != undefined}
                        backgroundColor={white}
                        hoverColor={green}
                        icon={<Done/>}
                        onClick={closeFunc}
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
