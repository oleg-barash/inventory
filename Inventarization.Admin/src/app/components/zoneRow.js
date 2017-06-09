/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Replay from 'material-ui/svg-icons/av/replay';
import Done from 'material-ui/svg-icons/action/done';
import Clear from 'material-ui/svg-icons/content/clear';
import {blue200 as blue}  from 'material-ui/styles/colors';
import {green200 as green}  from 'material-ui/styles/colors';
import {red200 as red}  from 'material-ui/styles/colors';
import {fullWhite as white}  from 'material-ui/styles/colors';
import { openZone, closeZone, clearZone } from '../actions/zoneActions';
import { setCurrentAction } from '../actions/actionActions';
import Add from 'material-ui/svg-icons/Content/add';
import { browserHistory } from 'react-router'
import moment from 'moment';
import { ZoneStatuses } from '../constants/zoneStatuses';
moment.locale("ru-RU")

class ZoneRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {zone, dispatch, inventorization, userInfo} = this.props;

        let openFunc = function () {
            dispatch(openZone(zone, inventorization.Id, userInfo.Token))
        }

        let closeFunc = function () {
            dispatch(closeZone(zone, inventorization.Id, userInfo.Token))
        }

        let clearFunc = function () {
            dispatch(clearZone(zone, inventorization.Id, userInfo.Token))
        }

        let newAction = function() {
            dispatch(setCurrentAction({Zone: zone, Type: 0}))
            browserHistory.push('/editAction');
        }

        let getStyle = function(zone){
            switch(zone.Status){
                case ZoneStatuses.Opened:
                    return { backgroundColor:  blue}
                case ZoneStatuses.Closed:
                    return { backgroundColor:  green}
                default:
                    return { backgroundColor:  white}
            }
        }

        return (
            <TableRow style={getStyle(zone)}>
                <TableRowColumn style={{width: '100px'}}>{zone.ZoneName}</TableRowColumn>
                <TableRowColumn style={{width: '100px'}}>{zone.OpenedAt == undefined ? "не открыта" : moment(zone.OpenedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn style={{width: '100px'}}>{zone.ClosedAt == undefined ? "не закрыта" : moment(zone.ClosedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn >
                    <FlatButton disabled={zone.Status == ZoneStatuses.Closed || zone.Status == ZoneStatuses.NotOpened}
                        hoverColor={blue}
                        icon={<Add/>}
                        onClick={newAction}
                    />
                    <FlatButton disabled={zone.Status != ZoneStatuses.NotOpened && zone.Status != ZoneStatuses.Closed}
                        hoverColor={red}
                        icon={<Replay/>}
                        onClick={openFunc}
                    />
                    <FlatButton disabled={zone.Status == ZoneStatuses.Closed || zone.Status == ZoneStatuses.NotOpened}
                        hoverColor={green}
                        icon={<Done/>}
                        onClick={closeFunc}
                    />
                    <FlatButton disabled={zone.Status == ZoneStatuses.Undefined}
                        hoverColor={red}
                        icon={<Clear/>}
                        onClick={clearFunc}
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

const mapStateToProps = (state) => {
    return {
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(ZoneRow)
