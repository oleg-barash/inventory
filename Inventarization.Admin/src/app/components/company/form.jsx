import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import { green100 as green } from 'material-ui/styles/colors';
import { yellow100 as yellow } from 'material-ui/styles/colors';
import { red100 as red } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router'
import Divider from 'material-ui/Divider';
import {
    validateCompany,
    saveCompany,
    openImportDialog,
    closeImportDialog,
    importItems
} from '../../actions/companyActions'
import Dialog from 'material-ui/Dialog';
import FileInput from 'react-file-input';
import {
    PARSE_DATA,
} from '../../constants/actionTypes'
import List from '../inventorization/list'
moment.locale("ru-RU")

const paperStyle = {
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    display: 'inline-block',
};


class Form extends Component {
    render() {
        let { company, userInfo, dispatch, dataForImport } = this.props;
        let onNameChange = function (event, value) {
            dispatch(validateCompany({ Name: value }));
        }

        let goBack = function () {
            browserHistory.push('/companies');
        }
        let save = function () {
            if (!!company.Name) {
                dispatch(saveCompany(company, userInfo.Token));
            }
            else {
                dispatch(validateCompany(company));
            }
        }


        function onImport() {
            dispatch(importItems(dataForImport, company.Id, userInfo.Token))
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
            dispatch({ type: PARSE_DATA, data: evt.target.result });
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
        return (
            <div>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                    <TextField id="Name" hintText="Наименование" floatingLabelText="Название компании" value={company.Name} onChange={onNameChange} errorText={company != null ? company.NameError || '' : ''} />
                    <Divider />
                    <FlatButton label="Назад" onClick={goBack} />
                    <FlatButton disabled={company.Readonly} label="Сохранить" onClick={save} disabled={!!company.NameError} />
                </Paper>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                    <label>Инвенторизации</label>
                    <List inventorizations={_.filter(userInfo.Inventorizations, x => x.Company === company.Id)}/>
                </Paper>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                    <FlatButton label="Импорт справочника" hoverColor={green} onClick={handleOpen} />
                    <Dialog
                        title="Загрузка справочника товаров"
                        actions={actionButtons}
                        modal={false}
                        read
                        open={this.props.isDialogOpened}
                        onRequestClose={handleClose}>
                        {this.props.importInProgress ? 'Идёт загрузка...' : 'Для загрузки справочника выберите файл и нажмите "Загрузить"'}
                        <br />
                        {!!this.props.dataForImport ? 'Распознано ' + this.props.dataForImport.length + ' товаров' : ''}
                    </Dialog>
                </Paper>
            </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        isDialogOpened: state.company.isImportDialogOpened,
        importInProgress: state.company.importInProgress,
        dataForImport: state.company.dataForImport
    }
}

export default connect(mapStateToProps)(Form)