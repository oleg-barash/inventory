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
import { validateItem, saveItem } from '../actions/itemActions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Divider from 'material-ui/Divider';

moment.locale("ru-RU")

const mapStateToProps = (state) => {
    return {
        item: state.item
    }
}

class ItemForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item, dispatch} = this.props;
        let onCodeChange = function(event) {
            dispatch(validateItem({Code: event.target.value}));
        }
        let onNameChange = function(event) {
            dispatch(validateItem({Name: event.target.value}));
        }
        let onQuantityChange = function(event) {
            dispatch(validateItem({Quantity: event.target.value}));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if (!!item.Name && !!item.Code && !!item.Quantity){
                dispatch(saveItem(item));
            }
            else{
                dispatch(validateItem({Code: item.Code || '', Name: item.Name || '', Quantity: item.Quantity || ''}));
            }
        }
        return (
            <Paper>
                <TextField id="BarCode" hintText="1234567890" floatingLabelText="Укажите код товара" value={item.Code} onChange={onCodeChange} errorText={item != null ? item.CodeError || '' : ''}/>
                <Divider />
                <TextField id="Name" hintText="Наименование" floatingLabelText="Наименование товара" value={item.Name} onChange={onNameChange} errorText={item != null ? item.NameError || '' : '' }/>
                <Divider />
                
                <TextField id="Description" 
                        multiLine={true}
                        rows={2}
                        rowsMax={4}
                        hintText="Описание товара" 
                        floatingLabelText="Описание товара" 
                        value={item.Description} />
                <Divider />
                <TextField id="Number" hintText="ИНВ-20141815052" floatingLabelText="Инвентарный номер товара"/>
                <Divider />
                <TextField id="Quantity" hintText="0" value={item.Quantity} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={item != null ? item.QuantityError || '' : '' }/>
                <Divider />
                <FlatButton label="Отменить" onClick={goBack} />
                <FlatButton label="Добавить" onClick={save} disabled={ !!item.CodeError || !!item.DescriptionError || !!item.QuantityError} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(ItemForm)