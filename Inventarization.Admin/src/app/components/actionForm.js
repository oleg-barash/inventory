/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component  } from 'react';
import moment from 'moment';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { validateAction, saveAction } from '../actions/actionActions'
import { fetchItems } from '../actions/itemActions'
import { fetchZones } from '../actions/zoneActions'

import { connect } from 'react-redux'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

moment.locale("ru-RU")

const mapStateToProps = (state) => {
    return {
        action: state.action,
        availabledZones: state.zones.items || [],
        availabledItems: state.items.items || []
    }
}

const itemDataSourceConfig = {
  text: 'BarCode',
  value: 'BarCode',
};

const itemNameDataSourceConfig = {
  text: 'Name',
  value: 'Name',
};

const zoneDataSourceConfig = {
  text: 'ZoneName',
  value: 'ZoneStatusId',
};

class ActionForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {action, dispatch, availabledItems} = this.props;
        if (!this.props.availabledItems || this.props.availabledItems.length == 0){
             dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'));
        }
        if (!this.props.availabledZones || this.props.availabledZones.length == 0){
            dispatch(fetchZones('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'));
        }
        let onItemChange = function(value) {
            dispatch(validateAction({Name: value.Name, BarCode: value.BarCode}));
        }
        
        let onZoneChange = function(value) {
            dispatch(validateAction({Zone: value}));
        }
        let onQuantityChange = function(event) {
            dispatch(validateAction({Quantity: event.target.value}));
        }
        let onTypeChange = function(event, index, value) {
            debugger
            dispatch(validateAction({Type: value}));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if (!!action.BarCode && !!action.Zone && !!action.Quantity){
                dispatch(saveAction(action));
            }
            else{
                dispatch(validateAction({BarCode: action.BarCode || '', Name: action.Name || '', Zone: action.Zone || '', Quantity: action.Quantity || ''}));
            }
        }
        return (
            <Paper>
                <AutoComplete 
                    fullWidth={true}
                    maxSearchResults={20}
                    id="BarCode"
                    hintText="1234567890" 
                    searchText={action.BarCode} 
                    floatingLabelText="Укажите код товара" 
                    dataSource={this.props.availabledItems}
                    onNewRequest={onItemChange} 
                    dataSourceConfig={itemDataSourceConfig}
                    filter={(searchText, key) => (key.startsWith(searchText))}
                    errorText={action != null ? action.CodeError || '' : '' }
                    />
                <AutoComplete 
                    fullWidth={true}
                    maxSearchResults={20}
                    id="Name"
                    hintText="Велотренажер" 
                    searchText={action.Name} 
                    floatingLabelText="Укажите наименование товара" 
                    dataSource={this.props.availabledItems}
                    onNewRequest={onItemChange} 
                    dataSourceConfig={itemNameDataSourceConfig}
                    filter={(searchText, key) => (key.indexOf(searchText) != -1)}
                    errorText={action != null ? action.NameError || '' : '' }
                    />
                <Divider />
                <TextField id="Quantity" hintText="0" value={action.Quantity} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={action != null ? action.QuantityError || '' : '' }/>
                <Divider />
                <AutoComplete 
                    id="Zone"
                    hintText="Зона 1" 
                    floatingLabelText="Зона"
                    dataSource={this.props.availabledZones}
                    searchText={action.Zone !== undefined ? action.Zone.ZoneName : ''} 
                    onNewRequest={onZoneChange}  
                    dataSourceConfig={zoneDataSourceConfig}
                    errorText={action != null ? action.ZoneError || '' : '' }/>
                <Divider />
                <SelectField
                        floatingLabelText="Тип действия"
                        value={action.Type}
                        onChange={onTypeChange}
                    >
                    <MenuItem value={0} primaryText="Первое сканирование" />
                    <MenuItem value={1} primaryText="Повторное сканирование" />
                    </SelectField>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton label="Добавить" onClick={save} disabled={ !!action.CodeError || !!action.ZoneError || !!action.QuantityError} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(ActionForm)