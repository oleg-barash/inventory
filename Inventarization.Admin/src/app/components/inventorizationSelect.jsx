import React, { PropTypes, Component  } from 'react';
import { connect } from 'react-redux'
import AuthorizedComponent from './authorizedComponent'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        inventorization: state.auth.SelectedInventorization,
        availabledInventorizations: state.auth.Inventorizations !== undefined ? state.auth.Inventorizations : [],
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
    render() {
        let { inventorization, 
            onInventorizationChanged, 
            errorText,
            companies
        } = this.props;
        
        let items = this.props.availabledInventorizations.map(item => {
            let name = item.Name + " (" + _.find(companies, x => x.Id === item.Company).Name + ")";
            return <MenuItem key={item.Id} value={item} primaryText={name} />
        });
        return (
            <SelectField floatingLabelText="Инвентаризация" value={inventorization} onChange={onInventorizationChanged}>
                {items}
            </SelectField>)
        }
}

export default connect(mapStateToProps)(InventorizationSelect)
