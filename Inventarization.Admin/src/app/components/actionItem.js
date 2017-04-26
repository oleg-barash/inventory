/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import {red700 as red}  from 'material-ui/styles/colors';
import {fullWhite as white}  from 'material-ui/styles/colors';
import { deleteAction } from '../actions/MainActions';
moment.locale("ru-RU")
function getTypeName(type){
    switch(type){
        case 0: return "первое сканирование";
        case 1: return "второе сканирование";
        case 2: return "третье сканирование";
        default: "неизвестно"
    }
}

class ActionRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {action, dispatch} = this.props;
        var style = {backgroundColor: action.IsDeleting ? red : white}

        var deleteFunc = function(){
            dispatch(deleteAction(action))
        }
        return (
            <TableRow>
                <TableRowColumn >{moment(action.DateTime).format("DD MMM hh:mm:ss")}</TableRowColumn>
                <TableRowColumn >{getTypeName(action.Type)}</TableRowColumn>
                <TableRowColumn >{action.User}</TableRowColumn>
                <TableRowColumn >{action.BarCode}</TableRowColumn>
                <TableRowColumn >{action.Zone}</TableRowColumn>
                <TableRowColumn >{action.Quantity}</TableRowColumn>
                <TableRowColumn >

                    <FlatButton
                        backgroundColor={white}
                        hoverColor={red}
                        icon={<DeleteAndroid/>}
                        style={style}
                        onClick={deleteFunc}
                    />
                    {/*<LinearProgress mode="indeterminate"/>*/}
                </TableRowColumn>
            </TableRow>)
    }
}

ActionRow.propTypes = {
    action: PropTypes.shape({
        Id: PropTypes.string.isRequired,
    }).isRequired
}


export default connect()(ActionRow)