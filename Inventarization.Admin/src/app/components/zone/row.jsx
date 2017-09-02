/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import Replay from 'material-ui/svg-icons/av/replay';
import Done from 'material-ui/svg-icons/action/done';
import Clear from 'material-ui/svg-icons/content/clear';
import { blue200 as blue } from 'material-ui/styles/colors';
import { green200 as green } from 'material-ui/styles/colors';
import { red200 as red } from 'material-ui/styles/colors';
import { yellow200 as yellow } from 'material-ui/styles/colors';
import { fullWhite as white } from 'material-ui/styles/colors';
import { openZone, closeZone, clearZone } from '../../actions/zoneActions';
import { setCurrentAction } from '../../actions/actionActions';
import Add from 'material-ui/svg-icons/Content/add';
import { browserHistory } from 'react-router'
import UsageRow from '../../components/zone/usageRow';
import _ from 'lodash'

const unknown = "unknown";
const done = "done";
const inProcess = "inProcess";
const error = "error";

let getZoneState = function (zone, actions) {

    if (zone.Usages == undefined || zone.Usages.length == 0){
        return unknown;
    }
    if (_.some(zone.Usages, { ClosedAt: null})) {
        return inProcess;
    }

    let counts = zone.Usages.map(x => {
        let currentActions = actions.filter(a => a.Type === x.Type);
        return currentActions != undefined ? _.sum(currentActions.map(a => a.Quantity)) : 0;
    }, true);

    return _.uniq(counts).length == 1 ? done : error;
}

let getBackgroundColor = function (state) {
    switch (state) {
        case inProcess: return yellow;
        case done: return green;
        case error: return red;
        default: return white;
    }
}

class Row extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { zone, actions, dispatch, inventorization, userInfo } = this.props;
        let usages = zone !== undefined ? _.sortBy(zone.Usages, x => x.Type) : [];
        let currentActions = actions.filter(a => a.Zone.Id === zone.Id)
        let state = getZoneState(zone, currentActions);
        let backgroundColor = getBackgroundColor(state);
        let style = { backgroundColor };
        return (
            <TableRow style={style} displayBorder={true} >
                <TableRowColumn style={{ width: '40px' }}>{zone.Number}</TableRowColumn>
                <TableRowColumn>
                    <Table>
                        <TableBody>
                            {usages.map(usage => {
                                let usageActions = currentActions.filter(x => x.Type === usage.Type);
                                return (<UsageRow zone={zone}
                                    usage={usage}
                                    key={usage.Type}
                                    actions={usageActions} />)
                            })}
                        </TableBody>
                    </Table>
                </TableRowColumn>
            </TableRow>
        )
    }
}

Row.propTypes = {
    zone: PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired,
    }).isRequired
}

const mapStateToProps = (state) => {
    return {
        actions: state.actions.items,
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(Row)
