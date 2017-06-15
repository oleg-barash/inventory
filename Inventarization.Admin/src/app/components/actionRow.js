/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import DeleteAndroid from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/Content/add';
import Edit from 'material-ui/svg-icons/Content/create';
import { green200 as green}  from 'material-ui/styles/colors';
import { yellow200 as yellow}  from 'material-ui/styles/colors';
import { blue200 as blue}  from 'material-ui/styles/colors';
import { red200 as red}  from 'material-ui/styles/colors';
import { fullWhite as white}  from 'material-ui/styles/colors';
import { deleteAction, setCurrentAction } from '../actions/actionActions';
import { setCurrentItem } from '../actions/itemActions';
import { Link, browserHistory } from 'react-router'
moment.locale("ru-RU")
function getTypeName(type){
    switch(type){
        case 0: return "первое сканирование";
        case 1: return "второе сканирование";
        case 2: return "слепой пересчёт";
        default: "неизвестно"
    }
}

class ActionRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {action, dispatch, userInfo} = this.props;
        var rowStyle = {backgroundColor: action.FoundInItems ? green : white}

        var deleteFunc = function(){
            dispatch(deleteAction(action, userInfo.Token))
        }


        var newItem = function() {
            dispatch(setCurrentItem({BarCode: action.BarCode, QuantityPlan: action.Quantity}))
            browserHistory.push('/editItem');
        }

        var editAction = function() {
            browserHistory.push('/editAction?id=' + action.Id);
        }
        return (
            <TableRow style={rowStyle}>
                <TableRowColumn style={{width: '200px'}}>{action.Description}</TableRowColumn>
                <TableRowColumn style={{width: '100px'}}>{moment(action.DateTime).format("DD MMM hh:mm:ss")}</TableRowColumn>
                <TableRowColumn style={{width: '100px'}}><small>{getTypeName(action.Type)}</small></TableRowColumn>
                {/*<TableRowColumn >{action.User}</TableRowColumn>*/}
                <TableRowColumn style={{width: '100px'}}>{action.BarCode}</TableRowColumn>
                <TableRowColumn style={{width: '50px'}}>{action.Zone.ZoneName}</TableRowColumn>
                <TableRowColumn style={{width: '50px'}}>{action.Quantity}</TableRowColumn>
                <TableRowColumn >
                    <FlatButton disabled={action.IsDeleting}
                        hoverColor={green}
                        icon={<Edit/>}
                        onClick={editAction}
                    />
                    <FlatButton disabled={action.IsDeleting}
                        hoverColor={red}
                        icon={<DeleteAndroid/>}
                        onClick={deleteFunc}
                    />
                    <FlatButton disabled={action.FoundInItems || action.IsDeleting}
                        hoverColor={blue}
                        icon={<Add/>}
                        onClick={newItem}
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
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(ActionRow)