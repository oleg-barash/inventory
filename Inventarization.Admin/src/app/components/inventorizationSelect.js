import React, { PropTypes, Component  } from 'react';
import { connect } from 'react-redux'
import AuthorizedComponent from './authorizedComponent'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
const mapStateToProps = (state) => {
    debugger
    return {
        userInfo: state.auth,
        inventorization: state.auth.SelectedInventorization,
        availabledInventorizations: state.auth.Inventorizations !== undefined ? state.auth.Inventorizations : []
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
            errorText 
        } = this.props;
        debugger
        let items = this.props.availabledInventorizations.map(item => <MenuItem key={item.Id} value={item} primaryText={item.Id} />);
        return (
            <SelectField floatingLabelText="Инвентаризация" value={inventorization} onChange={onInventorizationChanged}>
                {items}
            </SelectField>)
        }
}

export default connect(mapStateToProps)(InventorizationSelect)
