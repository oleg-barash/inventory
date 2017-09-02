import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import AuthorizedComponent from './authorizedComponent'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
    loadInventorizations
} from '../actions/inventorizationActions'
import _ from 'lodash';
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        inventorizations: state.inventorization.list,
        inventorization: state.auth.SelectedInventorization,
        companies: state.auth.Companies !== undefined ? state.auth.Companies : []
    }
}

const inventorizationDataSourceConfig = {
    text: 'Id',
    value: 'Id',
};

class InventorizationSelect extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let { inventorizations, userInfo, dispatch } = this.props;
        if (!inventorizations) {
            dispatch(loadInventorizations(userInfo.Token))
        }
    }
    render() {
        let { inventorization,
            inventorizations,
            onInventorizationChanged,
            errorText,
            companies
        } = this.props;
        let items = inventorizations !== undefined ? inventorizations.map(item => {
            let name = item.Name + " (" + _.find(companies, x => x.Id === item.Company).Name + ")";
            return <MenuItem key={item.Id} value={item} primaryText={name} />
        }) : [];
        return (
            <SelectField floatingLabelText="Инвентаризация" value={inventorization != undefined ? _.find(inventorizations, x => x.Id === inventorization.Id) : undefined} onChange={onInventorizationChanged}>
                {items}
            </SelectField>)
    }
}

export default connect(mapStateToProps)(InventorizationSelect)
