import React, { PropTypes, Component  } from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router'
import Divider from 'material-ui/Divider';
import { validateCompany, saveCompany } from '../../actions/companyActions'

moment.locale("ru-RU")

class Form extends Component {
    render() {
        let {company, userInfo, dispatch } = this.props;
        let onNameChange = function(event, value) {
            dispatch(validateCompany({Name: value}));
        }

        let goBack = function() {
            browserHistory.push('/companies');
        }
        let save = function() {
            if (!!company.Name){
                dispatch(saveCompany(company, userInfo.Token));
            }
            else{
                dispatch(validateCompany(company));
            }
        }
        return (
            <Paper>
                <TextField id="Name" hintText="Наименование" floatingLabelText="Название компании" value={company.Name} onChange={onNameChange} errorText={company != null ? company.NameError || '' : '' }/>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton disabled={company.Readonly} label="Сохранить" onClick={save} disabled={ !!company.NameError} />
            </Paper>)
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(Form)