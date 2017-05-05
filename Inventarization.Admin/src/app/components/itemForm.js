/**
 * Created by Барашики on 01.04.2017.
 */
import React, { PropTypes, Component  } from 'react';
import moment from 'moment';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { validateItem, saveItem } from '../actions/MainActions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

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
        let onDescriptionChange = function(event) {
            dispatch(validateItem({Description: event.target.value}));
        }
        let onQuantityChange = function(event) {
            dispatch(validateItem({Quantity: event.target.value}));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if (!!item.Code && !!item.Description && !!item.Quantity){
                dispatch(saveItem(item));
            }
            else{
                dispatch(validateItem({Code: item.Code || '', Description: item.Description || '', Quantity: item.Quantity || ''}));
            }
        }
        return (
            <div>
                <TextField id="BarCode" hintText="1234567890" floatingLabelText="Укажите код товара" value={item.Code} onChange={onCodeChange} errorText={item != null ? item.CodeError || '' : ''}/>
                <br/>
                <TextField id="Description" hintText="Наименование" floatingLabelText="Наименование товара" value={item.Description} onChange={onDescriptionChange} errorText={item != null ? item.DescriptionError || '' : '' }/>
                <br/>
                <TextField id="Number" hintText="ИНВ-20141815052" floatingLabelText="Инвентарный номер товара"/>
                <br/>
                <TextField id="Quantity" hintText="0" value={item.Quantity} onChange={onQuantityChange} floatingLabelText="Количество единиц товара" errorText={item != null ? item.QuantityError || '' : '' }/>
                <br/>
                <FlatButton label="Отменить" onClick={goBack} />
                <FlatButton label="Сохранить" onClick={save} disabled={ !!item.CodeError || !!item.DescriptionError || !!item.QuantityError} />
            </div>)
    }
}

export default connect(mapStateToProps)(ItemForm)