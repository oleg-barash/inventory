import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import _ from 'lodash'
import { connect } from 'react-redux'
import { green100 as green } from 'material-ui/styles/colors';
import { yellow100 as yellow } from 'material-ui/styles/colors';
import { red100 as red } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router'
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FileInput from 'react-file-input';
import DatePicker from 'material-ui/DatePicker';
import {
    PARSE_RESTS_DATA,
} from '../../constants/actionTypes'
import {
    saveInventorization,
    validateInventorization,
    importRests,
    openImportDialog,
    closeImportDialog
} from '../../actions/inventorizationActions'

import UserList from './userList'


import { loadCompanies } from '../../actions/companyActions'

const paperStyle = {
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    display: 'inline-block',
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        users: state.users.list,
        company: state.company,
        dataForImport: state.inventorization.dataForImport,
        isDialogOpened: state.inventorization.isImportDialogOpened,
    }
}

class Form extends Component {
    componentDidMount() {
        let { company, dispatch, userInfo, users } = this.props;
        if (!company.list) {
            dispatch(loadCompanies(userInfo.Token))
        }
    }
    render() {
        let { inventorization
            , userInfo
            , dispatch
            , company
            , dataForImport
            , companyId
            , users } = this.props;
        if (inventorization === undefined) {
            inventorization = { Company: companyId };
            if (companyId !== undefined) {
                inventorization.Company = companyId;
                dispatch(validateInventorization({ Company: companyId }));
            }
        }
        let onNameChange = function (event, value) {
            dispatch(validateInventorization({ Name: value }));
        }
        let onDateChange = function (event, value) {
            debugger
            dispatch(validateInventorization({ Date: value }));
        }


        let goBack = function () {
            browserHistory.goBack();
        }
        let save = function () {
            if (!!inventorization.Name) {
                dispatch(saveInventorization(inventorization, userInfo.Token));
            }
            else {
                dispatch(validateInventorization(inventorization));
            }
        }


        function onImport() {
            dispatch(importRests(dataForImport, inventorization.Id, userInfo.Token))
        };

        function updateProgress(evt) {
            if (evt.lengthComputable) {
                // evt.loaded and evt.total are ProgressEvent properties
                var loaded = (evt.loaded / evt.total);
                if (loaded < 1) {
                    // Increase the prog bar length
                    // style.width = (loaded * 200) + "px";
                }
            }
        }

        function loaded(evt) {
            dispatch({ type: PARSE_RESTS_DATA, data: evt.target.result });
        }

        function errorHandler(evt) {
            if (evt.target.error.name == "NotReadableError") {
                // The file could not be read
            }
        }

        function handleChange(event) {
            console.log('Selected file:', event.target.files[0]);
            var reader = new FileReader();
            reader.readAsText(event.target.files[0], "UTF-8");
            reader.onprogress = updateProgress;
            reader.onload = loaded;
            reader.onerror = errorHandler;
        };

        function handleOpen() {
            dispatch(openImportDialog())
        };

        function handleClose() {
            dispatch(closeImportDialog())
        };

        const actionButtons = [
            <FlatButton style={{ display: this.props.importInProgress ? "none" : "inlineBlock" }} label="Выбрать" keyboardFocused={true}>
                <FileInput name="dictionaryFile"
                    accept=".csv"
                    placeholder="Выбрать"
                    className="inputClass"
                    disabled={this.props.importInProgress}
                    onChange={handleChange} />
            </FlatButton>,
            <FlatButton
                label="Загрузить"
                primary={true}
                keyboardFocused={true}
                disabled={this.props.importInProgress || this.props.dataForImport == null || this.props.dataForImport.length == 0}
                onTouchTap={onImport}
            />,
            <FlatButton
                label="Закрыть"
                primary={true}
                keyboardFocused={true}
                onTouchTap={handleClose}
            />];
        let currentCompany = _.find(company.list, x => x.Id === inventorization.Company);
        return (
            !!currentCompany ?
                <div>
                    <Paper style={paperStyle} zDepth={3} rounded={false}>
                        <TextField hintText="Компания" disabled={true} floatingLabelText="Название компании" value={currentCompany.Name} />
                        <Divider />
                        <TextField id="Name" hintText="Название" floatingLabelText="Название инвентаризации" value={inventorization.Name} onChange={onNameChange} errorText={inventorization != null ? inventorization.NameError || '' : ''} />
                        <Divider />
                        <DatePicker hintText="Дата проведения" locale="ru-RU" value={inventorization.Date != undefined ? new Date(inventorization.Date) : new Date()} onChange={onDateChange} minDate={new Date()} />
                        <Divider />
                        <FlatButton label="Назад" onClick={goBack} />
                        <FlatButton disabled={inventorization.Readonly} label="Сохранить" onClick={save} disabled={!!inventorization.NameError} />
                    </Paper>
                    <Paper style={paperStyle} zDepth={3} rounded={false}>
                        <FlatButton label="Импорт справочника остатков" disabled={inventorization.Id === undefined} hoverColor={green} onClick={handleOpen} />
                        <Dialog
                            title="Загрузка справочника остатков"
                            actions={actionButtons}
                            modal={false}
                            open={this.props.isDialogOpened}
                            onRequestClose={handleClose}>
                            {this.props.importInProgress ? 'Идёт загрузка...' : 'Для загрузки справочника выберите файл и нажмите "Загрузить"'}
                            <br />
                            {!!this.props.dataForImport ? 'Распознано строк: ' + this.props.dataForImport.length : ''}
                        </Dialog>
                    </Paper>
                    <Divider />
                    <UserList id={inventorization.Id}/>
                </div> : null)
    }
}

export default connect(mapStateToProps)(Form)