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
import { fullWhite as white } from 'material-ui/styles/colors';
import { openZone, closeZone, clearZone } from '../../actions/zoneActions';
import { setCurrentAction } from '../../actions/actionActions';
import Add from 'material-ui/svg-icons/Content/add';
import { browserHistory } from 'react-router'
import UsageRow from '../../components/zone/usageRow';

import moment from 'moment';
moment.locale("ru-RU")

class Row extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { zone, actions, dispatch, inventorization, userInfo } = this.props;
        return (
            <TableRow>
                <TableRowColumn style={{ width: '40px' }}>{zone.Number}</TableRowColumn>
                <TableRowColumn>
                    <Table>
                        <TableBody>
                            {zone ? zone.Usages.map(usage => {
                                let usageActions = actions.filter((x) => x.Zone.Id === zone.Id && x.Type === usage.Type);
                                return (<UsageRow zone={zone}
                                    usage={usage}
                                    key={usage.Type}
                                    actions={usageActions} />)
                            }
                            ) : null}
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
