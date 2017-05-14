/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ActionRow from '../components/actionRow';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import { filterActions } from '../actions/actionActions'
const getActions = (items, filter) => {
    if (items == undefined){
        return [];
    }
    var result = items;
    if (filter !== undefined){
        if (filter.ZoneName !== undefined){
            result = result.filter((item) => {
                return item.Zone.toUpperCase().startsWith(filter.ZoneName.toUpperCase());
            })
        }
        if (filter.Code !== undefined){
            result = result.filter((item) => {
                return item.BarCode.toUpperCase().startsWith(filter.Code.toUpperCase());
            })
        }
    }
    return result;
}


const mapStateToProps = (state) => {
    return {
        actions: getActions(state.actions.items, state.actions.filter),
        filter: state.actions.filter
    }
}

class ActionList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var {actions, dispatch} = this.props;
        var objectClosure = this;
        function handleZoneChange(event) {
            objectClosure.props.dispatch(filterActions({ ZoneName: event.target.value }))
        };
        function handleCodeChange(event) {
            objectClosure.props.dispatch(filterActions({ Code: event.target.value }))
        };
        return (
            <div>
                <TextField 
                    id="zone-filter"
                    value={this.props.filter.ZoneName}
                    onChange={handleZoneChange}
                    hintText="Поиск по зоне"/>
                <TextField 
                    id="zone-filter"
                    value={this.props.filter.Code}
                    onChange={handleCodeChange}
                    hintText="Поиск по коду"/>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '200px'}}>Описание</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Время</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Тип</TableHeaderColumn>
                            {/*<TableHeaderColumn >Пользователь</TableHeaderColumn>*/}
                            <TableHeaderColumn style={{width: '100px'}}>Код</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '50px'}}>Зона</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '50px'}}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn >Действия</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {actions.map(action => <ActionRow dispatch={dispatch} action={action} key={action.Id}/>)}
                    </TableBody>
                </Table>
            </div>)
    }
}

export default connect(mapStateToProps)(ActionList)
