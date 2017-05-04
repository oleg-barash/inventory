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
            dispatch(validateItem({BarCode: event.target.value}));
        }
        let onDescriptionChange = function(event) {
            dispatch(validateItem({Description: event.target.value}));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let saveItem = function() {
            if (!!item.BarCode && item.Description){
                dispatch(saveItem(item));
            }
            else{
                dispatch(validateItem({BarCode: item.BarCode || '', Description: item.Description || ''}));
            }
        }
        return (
            <div>
                <TextField id="BarCode" hintText="1234567890" floatingLabelText="Укажите код товара" value={item.BarCode} onChange={onCodeChange} errorText={item != null ? item.BarCodeError || '' : ''}/>
                <br/>
                <TextField id="Description" hintText="Наименование" floatingLabelText="Наименование товара" value={item.Description} onChange={onDescriptionChange} errorText={item != null ? item.DescriptionError || '' : '' }/>
                <br/>
                <TextField id="Number" hintText="ИНВ-20141815052" floatingLabelText="Инвентарный номер товара"/>
                <br/>
                <TextField id="Quantity" hintText="0" value={item.Qoantity} floatingLabelText="Количество единиц товара"/>
                <br/>
                <FlatButton label="Отменить" onClick={goBack} />
                <FlatButton label="Сохранить" onClick={saveItem} disabled={ !!item.BarCodeError || !!item.DescriptionError } />
            </div>)
    }
}

export default connect(mapStateToProps)(ItemForm)