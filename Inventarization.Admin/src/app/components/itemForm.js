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
import { validateItem } from '../actions/MainActions'
import { connect } from 'react-redux'

moment.locale("ru-RU")

const mapStateToProps = (state) => {
    debugger;
    return {
        item: state.item
    }
}

class ItemForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        debugger;
        let {item, dispatch} = this.props;
        let onCodeChange = function(event) {
            dispatch(validateItem({BarCode: event.target.value}));
        }
        let onDescriptionChange = function(event) {
            dispatch(validateItem({Description: event.target.value}));
        }
        return (
            <div>
                <TextField id="BarCode" hintText="1234567890" floatingLabelText="Укажите код товара" value={item.BarCode} onChange={onCodeChange} errorText={item.BarCodeError || '' }/>
                <TextField id="Description" hintText="Наименование" floatingLabelText="Наименование товара" onChange={onDescriptionChange} errorText={item.DescriptionError || '' }/>
                <TextField id="Number" hintText="ИНВ-20141815052" floatingLabelText="Инвентарный номер товара"/>
                <br/>
                <FlatButton label="Отменить" />
                <FlatButton label="Сохранить" disabled={this.props.validationState.BarCode && this.props.validationState.Description} />
                <FlatButton label="Создать" />
            </div>)
    }
}

export default connect(mapStateToProps)(ItemForm)