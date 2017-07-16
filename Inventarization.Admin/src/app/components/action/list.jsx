/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Row from './row';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import { filterActions, updateActionsFilter } from '../../actions/actionActions'

const mapStateToProps = (state) => {
    return {
        actions: state.actions.filtredActions,
        filter: state.actions.filter
    }
}

class List extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var {actions, dispatch} = this.props;
        var objectClosure = this;
        function handleZoneChange(event) {
            objectClosure.props.dispatch(updateActionsFilter({ ZoneName: event.target.value }))
        };
        function handleCodeChange(event) {
            objectClosure.props.dispatch(updateActionsFilter({ Code: event.target.value }))
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
                <Table selectable={true} fixedHeader={true}  height={'600px'}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '200px'}}>Описание</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Время</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Тип</TableHeaderColumn>
                            {/*<TableHeaderColumn >Пользователь</TableHeaderColumn>*/}
                            <TableHeaderColumn style={{width: '100px'}}>Код</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '80px'}}>Зона</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '40px'}}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn >Действия</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {actions.map(action => <Row dispatch={dispatch} action={action} key={action.Id}/>)}
                    </TableBody>
                </Table>
            </div>)
    }
}

export default connect(mapStateToProps)(List)