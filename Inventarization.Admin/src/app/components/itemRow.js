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
        let item = this.props.item;
        let rowStyle = {
            backgroundColor: item.QuantityFact === 0 ? red : item.QuantityFact < item.QuantityPlan ? yellow : green
        }

        let editItem = function() {
            browserHistory.push('/editItem?id=' + item.Id);
        }
        let details = item.Actions.reduce( (previousValue, currentValue) => previousValue.concat(currentValue.ZoneDetails), []);
        return (
            <TableRow style={rowStyle}>
                <TableRowColumn style={{width: '280px'}}>{item.Name}</TableRowColumn>
                <TableRowColumn>{item.BarCode}</TableRowColumn>
                <TableRowColumn>{details.map((info) => {
                    return <Link key={info.Zone} to={{pathname: "/actions", query: { ZoneName: info.Zone, Code: item.BarCode} }}>{info.Zone}({info.Quantity})<br/>
                    </Link>
                }
                )}</TableRowColumn>
                <TableRowColumn>{item.QuantityFact}/{item.QuantityPlan}</TableRowColumn>
                <TableRowColumn>{item.Price  * item.QuantityFact}/{item.Price * item.QuantityPlan}</TableRowColumn>
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
        BarCode: PropTypes.string.isRequired,
    }).isRequired
}


export default ItemRow