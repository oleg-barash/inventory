/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Row from './row';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { filterActions, updateActionsFilter } from '../../actions/actionActions'
import { fetchZones } from '../../actions/zoneActions'

const mapStateToProps = (state) => {
    return {
        actions: state.actions.filtredActions,
        availableTypes: state.actions.availableTypes,
        userInfo: state.auth,
        inventorization: state.auth.SelectedInventorization,
        filter: state.actions.filter,
        zones: state.zones.items
    }
}

const typeDataSourceConfig = {
    text: 'text',
    value: 'id',
};

class List extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, inventorization, userInfo, zones } = this.props
        dispatch(fetchZones(inventorization.Id, userInfo.Token))
    }

    render() {
        let { actions, availableTypes, dispatch, zones } = this.props;
        function handleZoneChange(event, value) {
            let filterZone = _.find(zones, x => x.Number == value);
            if (filterZone != undefined){
                dispatch(updateActionsFilter({ Zone: filterZone }));
            }
            else{
                dispatch(updateActionsFilter({ Zone: undefined }));
            }
        };
        function handleCodeChange(event, value) {
            dispatch(updateActionsFilter({ Code: value }));
        };
        function handleTypeChange() {
            dispatch(updateActionsFilter({ Type: arguments[2] }));
        };
        return (
            <div>
                <TextField
                    id="zone-filter"
                    value={!!this.props.filter.Zone ? this.props.filter.Zone.Number : undefined}
                    onChange={handleZoneChange}
                    hintText="Поиск по зоне" />
                <TextField
                    id="zone-filter"
                    value={this.props.filter.Code}
                    onChange={handleCodeChange}
                    hintText="Поиск по коду" />
                <SelectField floatingLabelText="Поиск по типу просчёта" value={this.props.filter.Type} onChange={handleTypeChange}>
                    <MenuItem value={'0'} primaryText="первое сканирование" />
                    <MenuItem value={'1'} primaryText="второе сканирование" />
                    <MenuItem value={'2'} primaryText="слепой пересчёт" />
                    <MenuItem value={'3'} primaryText="всё" />
                </SelectField>

                <Table selectable={true} fixedHeader={true} height={'600px'}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{ width: '200px' }}>Описание</TableHeaderColumn>
                            <TableHeaderColumn style={{ width: '120px' }}>Время</TableHeaderColumn>
                            <TableHeaderColumn style={{ width: '100px' }}>Тип</TableHeaderColumn>
                            {/*<TableHeaderColumn >Пользователь</TableHeaderColumn>*/}
                            <TableHeaderColumn style={{ width: '100px' }}>Код</TableHeaderColumn>
                            <TableHeaderColumn style={{ width: '80px' }}>Зона</TableHeaderColumn>
                            <TableHeaderColumn style={{ width: '40px' }}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn >Действия</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {actions.map(action => <Row dispatch={dispatch} action={action} key={action.Id} />)}
                    </TableBody>
                </Table>
            </div>)
    }
}

export default connect(mapStateToProps)(List)
