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
import { fetchItems } from '../../actions/dictionaryActions'
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
        items: state.dictionary.items,
        inventorization: state.auth.SelectedInventorization,
        action: state.action,
        availabledZones: state.zones.items || [],
        availabledItems: state.dictionary
    }
}

const itemDataSourceConfig = {
  text: 'Code',
  value: 'Code',
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
        let {action, dispatch, availabledItems, inventorization, userInfo, availabledZones } = this.props;
        let zone = availabledZones.find(x => x.Id === action.Zone);
        if (!availabledItems.items && ! availabledItems.isFetching){
             dispatch(fetchItems(inventorization.Company, {}, userInfo.Token));
        }
        let onItemChange = function(value) {
            debugger
            dispatch(validateAction({Name: value.Name, BarCode: value.Code}));
        }
        
        let onZoneChange = function(value) {
            dispatch(validateAction({Zone: value.Id }));
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
        let item = _.find(availabledItems.items, x => x.Code == action.BarCode);
        let name = item !== undefined ? item.Name : '';
        return (
            <Paper>
                <AutoComplete 
                    fullWidth={true}
                    disabled={action.Id != undefined}
                    maxSearchResults={20}
                    id="BarCode"
                    hintText="1234567890" 
                    searchText={action.BarCode} 
                    floatingLabelText="Укажите код товара" 
                    dataSource={availabledItems.items || []}
                    style={action.Type == 2 ? {display:"none"} : {} }
                    onNewRequest={onItemChange} 
                    dataSourceConfig={itemDataSourceConfig}
                    filter={(searchText, key) => (key.startsWith(searchText))}
                    errorText={action != null ? action.BarCodeError || '' : '' }
                    />
                <AutoComplete 
                    fullWidth={true}
                    maxSearchResults={20}
                    disabled={action.Id != undefined}
                    id="Name"
                    hintText="Велотренажер" 
                    searchText={name} 
                    floatingLabelText="Укажите наименование товара" 
                    dataSource={availabledItems.items || []}
                    onNewRequest={onItemChange} 
                    style={action.Type == 2 ? {display:"none"} : {} }
                    dataSourceConfig={itemNameDataSourceConfig}
                    filter={(searchText, key) => (key.indexOf(searchText) != -1)}
                    errorText={action != null ? action.NameError || '' : '' }
                    />
                <Divider />
                <TextField id="Quantity" hintText="0" value={action.Quantity} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={action != null ? action.QuantityError || '' : '' }/>
                <Divider />
                <ZoneSelect zone={zone} disabled={action.Id != undefined}
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
                <FlatButton label="Сохранить" onClick={save} disabled={ !!action.BarCodeError || !!action.ZoneError || !!action.QuantityError} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(Form)