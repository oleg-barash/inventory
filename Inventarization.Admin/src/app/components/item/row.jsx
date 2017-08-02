/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component  } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Edit from 'material-ui/svg-icons/Content/create';
import { Link, browserHistory } from 'react-router'
moment.locale("ru-RU")
class ItemRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { item } = this.props;
        let actions = item.Actions;
        let rowStyle = {
            backgroundColor: item.QuantityFact === 0 ? red : item.QuantityFact < item.QuantityPlan ? yellow : green
        }

        let editItem = function() {
            browserHistory.push('/editItem?id=' + item.Id);
        }
        let zones = actions.reduce( (previousValue, currentValue) => previousValue.concat(currentValue.Zone), []);
        let totalFact = _.sumBy(actions, (a) => a.Quantity);

        let quantityValue = item.Count != undefined ? totalFact + '/' + item.Count + '(' + (totalFact - item.Count) + ')' : '-';
        let priceValue = item.Price != undefined ? item.Price*totalFact + '/' + item.Price*item.Count + '(' + reitemsts.Price * (totalFact - item.Count) + ')' : '-';

        return (
            <TableRow style={rowStyle}>
                <TableRowColumn style={{width: '280px'}}>{item.Name}</TableRowColumn>
                <TableRowColumn>{item.Code}</TableRowColumn>
                <TableRowColumn>{_.uniq(zones).map((zone) => {
                    debugger;
                    return <Link key={zone} to={{pathname: "/actions", query: { ZoneName: zone.ZoneName, Code: item.Code} }}>{zone.ZoneName}({_.sumBy(_.filter(actions, (a) => a.Zone.ZoneId == zone.ZoneId), (a) => a.Quantity)})<br/>
                    </Link>
                }
                )}</TableRowColumn>
                <TableRowColumn>{ quantityValue }</TableRowColumn>
                <TableRowColumn>{ priceValue }</TableRowColumn>
                <TableRowColumn>
                    <FlatButton disabled={item.IsDeleting}
                        hoverColor={green}
                        icon={<Edit/>}
                        onClick={editItem}
                    />
                </TableRowColumn>
            </TableRow>)
    }
}

ItemRow.propTypes = {
    item: PropTypes.shape({
        Code: PropTypes.string.isRequired,
    }).isRequired,
}


export default ItemRow