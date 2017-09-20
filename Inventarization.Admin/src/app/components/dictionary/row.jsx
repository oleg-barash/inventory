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

        let getSourceName = x => {
            switch(x){
                case 1:
                    return 'Импорт';
                case 2:
                    return 'Ручное создание';
                default:
                    return 'Неизвестно';
            }}

        return (
            <TableRow>
                <TableRowColumn style={{width: '280px'}}>{item.Name}</TableRowColumn>
                <TableRowColumn>{item.Code}</TableRowColumn>
                <TableRowColumn>{item.ItemNumber}</TableRowColumn>
                <TableRowColumn>{getSourceName(item.Source)}</TableRowColumn>
            </TableRow>)
    }
}

ItemRow.propTypes = {
    item: PropTypes.shape({
        Code: PropTypes.string.isRequired,
    }).isRequired,
}


export default ItemRow