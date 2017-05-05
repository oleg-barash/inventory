/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component  } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import {
  Link
} from 'react-router'
moment.locale("ru-RU")
class ItemRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var item = this.props.item;
        var rowStyle = {
            backgroundColor: item.QuantityFact === 0 ? red : item.QuantityFact < item.QuantityPlan ? yellow : green
        }
        
        return (
            <TableRow style={rowStyle}>
                <TableRowColumn style={{width: '280px'}}>{item.Description}</TableRowColumn>
                <TableRowColumn>{item.Number}</TableRowColumn>
                <TableRowColumn>{item.BarCode}</TableRowColumn>
                <TableRowColumn>{item.Actions.map((action) => <Link key={action.Zone} to={{pathname: "/actions", query: { ZoneName: action.Zone, Code: item.BarCode} }}>{action.Zone}<br/></Link>)}</TableRowColumn>
                <TableRowColumn>{item.QuantityPlan}</TableRowColumn>
                <TableRowColumn>{item.QuantityFact}</TableRowColumn>
            </TableRow>)
    }
}

ItemRow.propTypes = {
    item: PropTypes.shape({
        BarCode: PropTypes.string.isRequired,
    }).isRequired
}


export default ItemRow