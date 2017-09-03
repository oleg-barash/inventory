/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Replay from 'material-ui/svg-icons/av/replay';
import Done from 'material-ui/svg-icons/action/done';
import Clear from 'material-ui/svg-icons/content/clear';
import { blue200 as blue } from 'material-ui/styles/colors';
import { green200 as green } from 'material-ui/styles/colors';
import { red200 as red } from 'material-ui/styles/colors';
import { fullWhite as white } from 'material-ui/styles/colors';
import { openUsage, closeUsage, clearUsage } from '../../actions/usageActions';
import { setCurrentAction } from '../../actions/actionActions';
import Add from 'material-ui/svg-icons/Content/add';
import { Link, browserHistory } from 'react-router'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import moment from 'moment';
moment.locale("ru-RU")
import _ from 'lodash'

class UsageRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { zone, usage, actions, dispatch, inventorization, userInfo } = this.props;

        let openFunc = function () {
            dispatch(openUsage(zone, inventorization.Id, usage.Type, userInfo.Token))
        }

        let closeFunc = function () {
            dispatch(closeUsage(zone, inventorization.Id, usage.Type, userInfo.Token))
        }

        let clearFunc = function () {
            dispatch(clearUsage(zone, inventorization.Id, usage.Type, userInfo.Token))
        }

        let newAction = function () {
            dispatch(setCurrentAction({ Zone: zone, Type: usage.Type }))
            browserHistory.push('/editAction');
        }

        let getTypeText = function (type) {
            switch (type) {
                case 0: return "Первый пересчёт"
                case 1: return "Второй пересчёт"
                case 2: return "Слепой пересчёт"
                default:
                    return "Неизвестно"
            }
        }

        let sum = _.sum(actions.map(a => a.Quantity));
        let status = "не открыт";
        if (usage.OpenedAt !== null) {
            if (usage.ClosedAt !== null) {
                status = "закрыт " + moment(usage.ClosedAt).format('D MMM hh:mm');
            }
            else status = usage.AssignedAt !== null ? "в работе" : "открыт";
        }
        let assigned = usage.AssignedAt !== null ? usage.AssignedAt : "не назначен";
        return (
            <TableRow>
                <TableRowColumn style={{ width: '120px' }}>{getTypeText(usage.Type)}</TableRowColumn>
                <TableRowColumn style={{ width: '30px' }}>
                    <Link key={zone} to={{ pathname: "/actions", query: { ZoneName: zone.ZoneName, Type: usage.Type } }}>{sum}</Link>
                </TableRowColumn>
                <TableRowColumn style={{ width: '150px' }}>{status}</TableRowColumn>
                <TableRowColumn style={{ width: '150px' }}>{assigned}</TableRowColumn>
                <TableRowColumn >
                    <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    >
                        <MenuItem disabled={!!usage.ClosedAt && !usage.OpenedAt} color={blue} primaryText="Добавить действие" onClick={newAction} leftIcon={<Add />}/>
                        <MenuItem disabled={!!usage.OpenedAt && !usage.ClosedAt} color={red} primaryText="Открыть зону" onClick={openFunc} leftIcon={<Replay />}/>
                        <MenuItem disabled={!!usage.ClosedAt} color={green} primaryText="Закрыть зону" onClick={closeFunc} leftIcon={<Done />}/>
                        <MenuItem color={red} primaryText="Очистить зону" onClick={clearFunc} leftIcon={<Clear />}/>
                    </IconMenu>
                </TableRowColumn>
            </TableRow>
        )
    }
}

UsageRow.propTypes = {
    zone: PropTypes.shape({
        Id: PropTypes.string.isRequired,
    }).isRequired,
    usage: PropTypes.shape({
        Id: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
        Id: PropTypes.string.isRequired,
    }).isRequired
}

const mapStateToProps = (state) => {
    return {
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(UsageRow)
