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
import { validateAction, saveAction, loadCurrentAction } from '../../actions/actionActions'
import { fetchItems } from '../../actions/itemActions'
import { fetchZones } from '../../actions/zoneActions'
import ZoneSelect from '../zone/select'
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
        userInfo: state.auth,
        inventorization: state.auth.SelectedInventorization,
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

class Form extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {action, dispatch, availabledItems, inventorization, userInfo} = this.props;
        if (!this.props.availabledItems || this.props.availabledItems.length == 0){
             dispatch(fetchItems(inventorization.Id, {}, userInfo.Token));
        }
        if (!this.props.availabledZones || this.props.availabledZones.length == 0){
            dispatch(fetchZones(inventorization.Id, userInfo.Token));
        }
        let onItemChange = function(value) {
            dispatch(validateAction({Name: value.Name, BarCode: value.BarCode}));
        }
        
        let onZoneChange = function(value) {
            dispatch(validateAction({Zone: value }));
        }
        let onQuantityChange = function(event) {
            dispatch(validateAction({Quantity: event.target.value}));
        }
        let onTypeChange = function(event, index, value) {
            dispatch(validateAction({Type: value}));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if ((action.Type == 2 || !!action.BarCode) && !!action.Zone && !!action.Quantity){
                dispatch(saveAction(action, inventorization.Id, userInfo.Token));
            }
            else{
                dispatch(validateAction({BarCode: action.BarCode || '', Name: action.Name || '', Zone: action.Zone, Quantity: action.Quantity || ''}));
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
                    style={action.Type == 2 ? {display:"none"} : {} }
                    onNewRequest={onItemChange} 
                    dataSourceConfig={itemDataSourceConfig}
                    filter={(searchText, key) => (key.startsWith(searchText))}
                    errorText={action != null ? action.BarCodeError || '' : '' }
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
                    style={action.Type == 2 ? {display:"none"} : {} }
                    dataSourceConfig={itemNameDataSourceConfig}
                    filter={(searchText, key) => (key.indexOf(searchText) != -1)}
                    errorText={action != null ? action.NameError || '' : '' }
                    />
                <Divider />
                <TextField id="Quantity" hintText="0" value={action.Quantity} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={action != null ? action.QuantityError || '' : '' }/>
                <Divider />
                <ZoneSelect zone={!!action ? action.Zone : {}} 
                    onZoneChange={onZoneChange}  
                    errorText={action != null ? action.ZoneError || '' : '' }/>
                <Divider />
                <SelectField
                        floatingLabelText="Тип действия"
                        value={action.Type}
                        onChange={onTypeChange}
                    >
                    <MenuItem value={0} primaryText="Первое сканирование" />
                    <MenuItem value={1} primaryText="Повторное сканирование" />
                    <MenuItem value={2} primaryText="Слепой просчёт" />
                    </SelectField>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton label="Сохранить" onClick={save} disabled={ !!action.CodeError || !!action.ZoneError || !!action.QuantityError} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(Form)