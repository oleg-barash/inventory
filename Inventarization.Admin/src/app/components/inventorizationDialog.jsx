import React, { Component } from 'react';
import AuthorizedComponent from './authorizedComponent'
import InventorizationSelect from './inventorizationSelect'
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog';
import { closeInventorizationDialog, setInventorization } from '../actions/authorizationActions'

import { fetchActions } from '../actions/actionActions'
import { fetchItems } from '../actions/dictionaryActions'
import { fetchRests } from '../actions/restsActions'
import { fetchZones } from '../actions/zoneActions'

import { browserHistory } from 'react-router'

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
    }
}

class InventorizationDialog extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let { userInfo, dispatch } = this.props;
        function handleClose() {
            dispatch(closeInventorizationDialog());
        }

        function inventorizationSelected(event, target, value) {
            dispatch(setInventorization(value));
            dispatch(fetchActions(value.Id, userInfo.Token));
            dispatch(fetchItems(value.Company, {}, userInfo.Token));
            dispatch(fetchRests(value.Id, userInfo.Token));
            dispatch(fetchZones(value.Id, userInfo.Token));
        }
        return <Dialog title="Выбор инвентаризации"
            actions={<FlatButton
                label="Готово"
                disabled={userInfo.SelectedInventorization === undefined}
                primary={true}
                keyboardFocused={true}
                onTouchTap={handleClose}
            />}
            modal={true}
            open={userInfo.isInventorizationDialogOpened}
            onRequestClose={handleClose}>
            Для продолжения работы выберите инвентаризацию
                    <InventorizationSelect cookies={this.props.cookies} onInventorizationChanged={inventorizationSelected} />
        </Dialog>
    }
}

export default connect(mapStateToProps)(InventorizationDialog)