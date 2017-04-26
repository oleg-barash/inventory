/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import { fullWhite as white}  from 'material-ui/styles/colors';
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
        var buttonStyle = {backgroundColor: action.IsDeleting ? red : white}
        var rowStyle = {backgroundColor: action.FoundInItems ? green : white}

        var deleteFunc = function(){
            dispatch(deleteAction(action))
        }
        return (
            <TableRow style={rowStyle}>
                <TableRowColumn >{action.Description}</TableRowColumn>
                <TableRowColumn >{moment(action.DateTime).format("DD MMM hh:mm:ss")}</TableRowColumn>
                <TableRowColumn >{getTypeName(action.Type)}</TableRowColumn>
                {/*<TableRowColumn >{action.User}</TableRowColumn>*/}
                <TableRowColumn >{action.BarCode}</TableRowColumn>
                <TableRowColumn >{action.Zone}</TableRowColumn>
                <TableRowColumn >{action.Quantity}</TableRowColumn>
                <TableRowColumn >

                    <FlatButton
                        backgroundColor={white}
                        hoverColor={red}
                        icon={<DeleteAndroid/>}
                        style={buttonStyle}
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