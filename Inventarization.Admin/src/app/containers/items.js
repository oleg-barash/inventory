/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemList from '../components/itemList'
import { 
    fetchItems, 
    applyItemsFilter, 
    filterItems, 
    openImportDialog, 
    closeImportDialog,
    loadMoreItems,
    updateItemsFilter,
    requestItems,
    importItems
} from '../actions/itemActions'
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { green100 as green}  from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FileInput  from 'react-file-input';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const mapStateToProps = (state) => {
    return {
        items: state.items.displayItems,
        isFetching: state.items.isFetching,
        isDialogOpened: state.items.isImportDialogOpened,
        filter: state.items.filter,
        dispatch: state.dispatch
    }
}
const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

const paperStyle = {
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    display: 'inline-block',
};

class Items extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidMount() {
        this.props.dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }

    render() {
        let objectClosure = this;
        let itemsToUpload = [];
        function handleFilterChange(event, value) {
            objectClosure.props.dispatch(updateItemsFilter({ text: value }))
            objectClosure.props.dispatch(filterItems({ text: value }))
        };
        function handleStateChange(event, value) {
            objectClosure.props.dispatch(updateItemsFilter({ type: value }))
            objectClosure.props.dispatch(filterItems({ type: value }))
        };

        function handleOpen () {
            objectClosure.props.dispatch(openImportDialog())
        };

        function handleLoadMore () {
            objectClosure.props.dispatch(requestItems())
            objectClosure.props.dispatch(filterItems({currentPage: objectClosure.props.filter.currentPage + 1}))
        };

        function handleClose () {
            objectClosure.props.dispatch(closeImportDialog())
        };

        function onImport () {
            objectClosure.props.dispatch(importItems(itemsToUpload))
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
            debugger
            let fileString = evt.target.result;
            let rows = fileString.split("\n");
            itemsToUpload = rows.map((row) => {
                let columns = row.split(",")
                return {
                    Name: columns[0],
                    BarCode: columns[1]
                }
            });
        }

        function errorHandler(evt) {
            if(evt.target.error.name == "NotReadableError") {
                // The file could not be read
            }
        }

        function handleChange(event) {
            console.log('Selected file:', event.target.files[0]);
            debugger
            var reader = new FileReader();
            reader.readAsText(event.target.files[0], "UTF-8");
            reader.onprogress = updateProgress;
            reader.onload = loaded;
            reader.onerror = errorHandler;
        };

        const style = {
            container: {
                position: 'relative',
            },
            refresh: {
                display: 'inlineBlock',
                position: 'relative',
            }
        };

        const actions = [
            <RefreshIndicator status={this.props.importInProgress ? "loading" : "none" } left={70} top={0}/>,
            <FlatButton style={{display: this.props.importInProgress ? "none" : "inlineBlock"}} label="Выбрать" keyboardFocused={true}>
                <FileInput name="dictionaryFile"
                   accept=".csv"
                   placeholder="Выбрать"
                   className="inputClass"
                   onChange={handleChange} />
            </FlatButton>,
            <FlatButton
                label="Загрузить"
                primary={true}
                keyboardFocused={true}
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
                <TextField 
                    id="text-filter"
                    value={this.props.filter.text}
                    onChange={handleFilterChange}
                    hintText="Поиск"/>

                <RadioButtonGroup name="itemState" defaultSelected="0" onChange={handleStateChange}>
                    <RadioButton
                        value="0"
                        label="Показывать все"
                        style={styles.radioButton}
                    />
                    <RadioButton
                        value="1"
                        label="Показать недостачу"
                        style={styles.radioButton}
                    />
                    <RadioButton
                        value="2"
                        label="Показать избытки"
                        style={styles.radioButton}
                    />
                </RadioButtonGroup>
            </Paper>
            <Paper style={paperStyle} zDepth={3} rounded={false}>
                <FlatButton label="Импорт" hoverColor={green} onClick={handleOpen}/>
                <Dialog
                    title="Загрузка справочника товаров"
                    actions={actions}
                    modal={false}
                    open={this.props.isDialogOpened}
                    onRequestClose={handleClose}>
                    Для загрузки справочника выберите файл и нажмите "Загрузить"
                </Dialog>
            </Paper>
            <h2 style={{display: this.props.isFetching ? "block" : "none"}}>
                Загрузка...
            </h2>
            <ItemList items={this.props.items} filter={this.props.filter}/>
            <FlatButton style={{display: this.props.isFetching ? "none" : "block"}} label="Загрузить ещё" hoverColor={green} onClick={handleLoadMore}/>
            <h2 style={{display: this.props.isFetching && this.props.items.length > 0 ? "block" : "none"}}>
                Загрузка...
            </h2>
        </div>)
    }
}

Items.propTypes = {
    items: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Items)
