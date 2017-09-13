/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import moment from 'moment';
import { green100 as green } from 'material-ui/styles/colors';
import { yellow100 as yellow } from 'material-ui/styles/colors';
import { red100 as red } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Edit from 'material-ui/svg-icons/Content/create';
import { Link, browserHistory } from 'react-router'
import _ from 'lodash'
moment.locale("ru-RU")

let getCountInZone = function(actions, zoneId){
    var actionsInZone = _.filter(actions, (a) => a.Zone.Id == zoneId);
    return _.sumBy(actionsInZone, (a) => a.Quantity);
}

class ItemRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { item } = this.props;
        let actions = item.Actions;

        let editItem = function () {
            browserHistory.push('/editItem?id=' + item.Id);
        }

        let quantityValue = '-';
        let zones = [];
        let totalFact = 0;
        if (actions != undefined) {
            zones = actions.reduce((previousValue, currentValue) => previousValue.concat(currentValue.Zone), []);
            totalFact = _.sumBy(actions, (a) => a.Quantity);
        }
        quantityValue = (totalFact != undefined ? totalFact : '-') + '/' + (item.Count != undefined ? item.Count : '-');
        if (item.Count != undefined || totalFact != undefined) {
            if (totalFact != undefined && item.Count != undefined) {
                quantityValue += '(' + (totalFact - item.Count) + ')';
            }
        }
        let priceValue = item.Price != undefined && (item.Count != undefined || totalFact != undefined) ? item.Price * totalFact + '/' + item.Price * item.Count + '(' + item.Price * (totalFact - item.Count) + ')' : '-';

        let rowStyle = {
            backgroundColor: totalFact === 0 ? red : totalFact < item.Count ? yellow : green
        }
        
        return (
            <TableRow style={rowStyle}>
                <TableRowColumn style={{ width: '280px' }}>{item.Name}</TableRowColumn>
                <TableRowColumn style={{ width: '120px' }}>{item.Code}</TableRowColumn>
                <TableRowColumn style={{ width: '90px' }}>{_.uniq(zones).map((zone) => {
                    return <Link key={zone} to={{ pathname: "/actions", query: { ZoneName: zone.ZoneName, Code: item.Code } }}>{zone.ZoneName}({getCountInZone(actions, zone.Id)})<br />
                    </Link>
                }
                )}</TableRowColumn>
                <TableRowColumn style={{ width: '70px' }}>{quantityValue}</TableRowColumn>
                <TableRowColumn style={{ width: '100px' }}>{priceValue}</TableRowColumn>
            </TableRow>)
    }
}

ItemRow.propTypes = {
    item: PropTypes.shape({
        Code: PropTypes.string.isRequired,
    }).isRequired,
}


export default ItemRow