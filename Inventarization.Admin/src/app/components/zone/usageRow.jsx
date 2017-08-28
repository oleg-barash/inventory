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
import { browserHistory } from 'react-router'
import moment from 'moment';
import _ from 'lodash'
moment.locale("ru-RU")

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

        // let getStyle = function(zone){
        //     switch(zone.Status){
        //         default:
        //             return { backgroundColor:  white}
        //     }
        // }
        let sum = _.sum(actions.map(a => a.Quantity));
        return (
            <TableRow>
                <TableRowColumn style={{ width: '120px' }}>{getTypeText(usage.Type)}</TableRowColumn>
                <TableRowColumn style={{ width: '80px' }}>{sum}</TableRowColumn>
                {/*<TableRowColumn style={{width: '40px'}}>{usage.OpenedBy}</TableRowColumn>*/}
                <TableRowColumn style={{ width: '150px' }}>{usage.OpenedAt == undefined ? "не открыта" : moment(usage.OpenedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                <TableRowColumn style={{ width: '150px' }}>{usage.ClosedAt == undefined ? "не закрыта" : moment(usage.ClosedAt).format("DD MMMM hh:mm")}</TableRowColumn>
                {/*<TableRowColumn style={{width: '100px'}}>{usage.ClosedBy}</TableRowColumn>*/}
                <TableRowColumn >
                    <FlatButton disabled={!usage.ClosedAt || !!usage.OpenedAt}
                        hoverColor={blue}
                        icon={<Add />}
                        onClick={newAction}
                    />
                    <FlatButton disabled={!!usage.OpenedAt && !usage.ClosedAt}
                        hoverColor={red}
                        icon={<Replay />}
                        onClick={openFunc}
                    />
                    <FlatButton disabled={!usage.ClosedAt || !usage.OpenedAt}
                        hoverColor={green}
                        icon={<Done />}
                        onClick={closeFunc}
                    />
                    <FlatButton
                        hoverColor={red}
                        icon={<Clear />}
                        onClick={clearFunc}
                    />

                    {/*<LinearProgress mode="indeterminate"/>*/}
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
