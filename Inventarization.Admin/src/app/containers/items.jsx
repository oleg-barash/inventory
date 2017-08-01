/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import List from '../components/item/list'
import { 
    fetchItems, 
    applyItemsFilter, 
    filterItems, 
    openImportDialog, 
    closeImportDialog,
    loadMoreItems,
    updateItemsFilter,
    requestItems
} from '../actions/itemActions'
import { fetchRests } from '../actions/restsActions'
import { fetchActions } from '../actions/actionActions'
import { fetchZones } from '../actions/zoneActions';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { green100 as green}  from 'material-ui/styles/colors';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Select from '../components/zone/select'
import AuthorizedComponent from '../components/authorizedComponent'
import { openInventorizationDialog } from '../actions/authorizationActions'


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

class Items extends AuthorizedComponent {
    constructor(props) {
      super(props);
    }
    componentWillMount() {
        if (this.props.userInfo.Token != undefined && this.props.userInfo.SelectedInventorization !== undefined){
            this.props.dispatch(fetchItems(this.props.userInfo.SelectedInventorization.Id, {}, this.props.userInfo.Token))
            this.props.dispatch(fetchRests(this.props.userInfo.SelectedInventorization.Id, this.props.userInfo.Token))
            this.props.dispatch(fetchActions(this.props.userInfo.SelectedInventorization.Id, this.props.userInfo.Token, this.props.actionsUpdateDate))
        }
        else{
            this.props.dispatch(openInventorizationDialog());
        }
        if ((!this.props.availabledZones || this.props.availabledZones.length == 0) && this.props.userInfo.SelectedInventorization != undefined){
            this.props.dispatch(fetchZones(this.props.userInfo.SelectedInventorization.Id, this.props.userInfo.Token));
        }
    }

    render() {
        let objectClosure = this;
 
        let { dispatch, userInfo, filter, actions } = this.props;

        if (!userInfo.SelectedInventorization){
            return null;
        }

        function handleFilterChange(event, value) {
            dispatch(updateItemsFilter({ text: value }))
            dispatch(filterItems({ text: value }))
        };
        function handleStateChange(event, value) {
            dispatch(updateItemsFilter({ type: value }))
            dispatch(filterItems({ type: value }))
        };
        function handleLoadMore () {
            dispatch(requestItems())
            dispatch(filterItems({currentPage: filter.currentPage + 1}))
        };

        function handleDeviationChange(event, value) {
            dispatch(updateItemsFilter({ devation: value }))
            dispatch(filterItems({ devation: value }))
        };

        function handlePriceDeviationChange(event, value) {
            dispatch(updateItemsFilter({ priceDevation: value }))
            dispatch(filterItems({ priceDevation: value }))
        };


        let onZoneChange = function(value) {
            if (typeof value === "string"){
                dispatch(updateItemsFilter({ zone: undefined }))
                dispatch(filterItems({ zone: undefined }))
            }
            else{
                dispatch(updateItemsFilter({ zone: value }))
                dispatch(filterItems({ zone: value }))
            }
        }

        const style = {
            container: {
                position: 'relative',
            },
            refresh: {
                display: 'inlineBlock',
                position: 'relative',
            }
        };


        return (
        <div>  
            <Paper style={paperStyle} zDepth={3} rounded={false}>  
                <h2 style={{display: "block"}}>Фильтр</h2>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                    <TextField 
                        id="text-filter"
                        floatingLabelText="Текстовый поиск"
                        value={this.props.filter.text}
                        onChange={handleFilterChange}/>
                    <br/>
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
                    <Select zone={!!this.props ? this.props.filter.zone : {}} onZoneChange={onZoneChange}/>
                </Paper>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                    <TextField 
                        id="deviation-filter"
                        value={this.props.filter.deviation}
                        onChange={handleDeviationChange}
                        floatingLabelText="Расхождения по количеству"
                        type="number"/>
                    <br/>
                    <TextField 
                        id="priceDevation-filter"
                        value={this.props.filter.priceDevation}
                        onChange={handlePriceDeviationChange}
                        floatingLabelText="Расхождения по сумме"
                        type="number"/>
                </Paper>
            </Paper>
            <h2 style={{display: this.props.isFetching ? "block" : "none"}}>
                Загрузка...
            </h2>
            <List items={this.props.items} filter={this.props.filter} rests={this.props.rests} actions={this.props.actions}/>
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

const mapStateToProps = (state) => {
    return {
        items: state.items.items,
        isFetching: state.items.isFetching,
        filter: state.items.filter,
        dispatch: state.dispatch,
        userInfo: state.auth,
        availabledZones: state.zones.items,
        rests: state.rests.items,
        actions: state.actions.filtredActions,
        actionsUpdateDate: state.actions.lastUpdated
    }
}

export default connect(mapStateToProps)(Items)
