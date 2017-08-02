import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import List from '../components/item/list'
import {
    applyItemsFilter,
    filterItems,
    openImportDialog,
    closeImportDialog,
    loadMoreItems,
    updateItemsFilter,
    requestItems
} from '../actions/itemActions'

import {
    fetchItems,
} from '../actions/dictionaryActions'

import { fetchRests } from '../actions/restsActions'
import { fetchActions } from '../actions/actionActions'
import { fetchZones } from '../actions/zoneActions';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { green100 as green } from 'material-ui/styles/colors';
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

class Items extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        let { dispatch, userInfo, actionsUpdateDate, availabledZones } = this.props;
        if (userInfo.Token != undefined && this.props.userInfo.SelectedInventorization !== undefined) {
            dispatch(fetchItems(userInfo.SelectedInventorization.Company, {}, userInfo.Token))
            dispatch(fetchRests(userInfo.SelectedInventorization.Id, userInfo.Token))
            dispatch(fetchActions(userInfo.SelectedInventorization.Id, userInfo.Token, actionsUpdateDate))
        }
        else {
            dispatch(openInventorizationDialog());
        }
        if ((!availabledZones || availabledZones.length == 0) && userInfo.SelectedInventorization != undefined) {
            dispatch(fetchZones(userInfo.SelectedInventorization.Id, userInfo.Token));
        }
    }

    render() {
        var { dispatch, userInfo, filter, actions } = this.props;

        if (!userInfo.SelectedInventorization) {
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
        function handleLoadMore() {
            dispatch(requestItems())
            dispatch(filterItems({ currentPage: filter.currentPage + 1 }))
        };

        function handleDeviationChange(event, value) {
            dispatch(updateItemsFilter({ devation: value }))
            dispatch(filterItems({ devation: value }))
        };

        function handlePriceDeviationChange(event, value) {
            dispatch(updateItemsFilter({ priceDevation: value }));
            dispatch(filterItems({ priceDevation: value }));
        };

        let style = {
            container: {
                position: 'relative',
            },
            refresh: {
                display: 'inlineBlock',
                position: 'relative',
            }
        };

        let onZoneChange = function (value) {
            if (typeof value === "string") {
                dispatch(updateItemsFilter({ zone: undefined }));
                dispatch(filterItems({ zone: undefined }));
            }
            else {
                dispatch(updateItemsFilter({ zone: value }));
                dispatch(filterItems({ zone: value }));
            }
        };

        return (
            <div>
                <h2 style={{ display: "block" }}>Фильтр</h2>
                <Paper style={paperStyle} zDepth={3} rounded={false}>
                        <TextField
                            id="text-filter"
                            floatingLabelText="Текстовый поиск"
                            value={this.props.filter.text}
                            onChange={handleFilterChange} />
                        <Select zone={!!this.props ? this.props.filter.zone : {}} onZoneChange={onZoneChange} />
                    </Paper>

                <Paper style={paperStyle} zDepth={3} rounded={false}>
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
                        <Divider/>
                        <TextField
                            id="deviation-filter"
                            value={this.props.filter.deviation}
                            onChange={handleDeviationChange}
                            floatingLabelText="Расхождения по количеству"
                            type="number" />
                        <TextField
                            id="priceDevation-filter"
                            value={this.props.filter.priceDevation}
                            onChange={handlePriceDeviationChange}
                            floatingLabelText="Расхождения по сумме"
                            type="number" />
                    </Paper>
                <h2 style={{ display: this.props.isFetching ? "block" : "none" }}>Загрузка...</h2>
                <List items={this.props.items} />
                <FlatButton style={{ display: this.props.isFetching ? "none" : "block" }} label="Загрузить ещё" hoverColor={green} onClick={handleLoadMore} />
                <h2 style={{ display: this.props.isFetching && this.props.items.length > 0 ? "block" : "none" }}>Загрузка...</h2>
            </div>);
    }
};

const mapStateToProps = (state) => {
    return {
        items: state.items.displayItems,
        isFetching: state.items.isFetching,
        filter: state.items.filter,
        dispatch: state.dispatch,
        userInfo: state.auth,
        availabledZones: state.zones.items,
        actionsUpdateDate: state.actions.lastUpdated
    };
}

export default connect(mapStateToProps)(Items)
