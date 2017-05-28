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
        item: state.item,
        inventorization: state.auth.SelectedInventorization
    }
}

class ItemForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item, dispatch, inventorization} = this.props;
        let onCodeChange = function(event) {
            dispatch(validateItem({BarCode: event.target.value}));
        }
        let onNameChange = function(event) {
            dispatch(validateItem({Name: event.target.value}));
        }
        let onDescriptionChange = function(event) {
            dispatch(validateItem({Description: event.target.value}));
        }
        let onQuantityChange = function(event) {
            dispatch(validateItem({QuantityPlan: event.target.value}));
        }
        let onNumberChange = function(event) {
            dispatch(validateItem({Number: event.target.value}));
        }

        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if (!!item.Name && !!item.BarCode && !!item.QuantityPlan){
                dispatch(saveItem(item, inventorization.Company));
            }
            else{
                dispatch(validateItem({BarCode: item.BarCode || '', Name: item.Name || '', QuantityPlan: item.QuantityPlan || ''}));
            }
        }
        return (
            <Paper>
                <TextField disabled={item.Readonly} id="BarCode" hintText="1234567890" floatingLabelText="Укажите код товара" value={item.BarCode} onChange={onCodeChange} errorText={item != null ? item.CodeError || '' : ''}/>
                <Divider />
                <TextField disabled={item.Readonly} id="Name" hintText="Наименование" floatingLabelText="Наименование товара" value={item.Name} onChange={onNameChange} errorText={item != null ? item.NameError || '' : '' }/>
                <Divider />
                
                <TextField disabled={item.Readonly} id="Description" 
                        multiLine={true}
                        rows={2}
                        rowsMax={4}
                        hintText="Описание товара" 
                        floatingLabelText="Описание товара" 
                        onChange={onDescriptionChange}
                        value={item.Description} />
                <Divider />
                <TextField disabled={item.Readonly} id="Number" value={item.Number} onChange={onNumberChange} hintText="ИНВ-20141815052" floatingLabelText="Инвентарный номер товара"/>
                <Divider />
                <TextField disabled={item.Readonly} id="Quantity" hintText="0" value={item.QuantityPlan} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={item != null ? item.QuantityError || '' : '' }/>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton disabled={item.Readonly} label="Сохранить" onClick={save} disabled={ !!item.CodeError || !!item.DescriptionError || !!item.QuantityError} />
            </Paper>)
    }
}

export default connect(mapStateToProps)(ItemForm)