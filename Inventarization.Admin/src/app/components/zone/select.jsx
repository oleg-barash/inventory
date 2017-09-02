import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { fetchZones } from '../../actions/zoneActions'
import AutoComplete from 'material-ui/AutoComplete';
const mapStateToProps = (state) => {
    return {
        availabledZones: state.zones,
        userInfo: state.auth
    }
}
const zoneDataSourceConfig = {
    text: 'ZoneName',
    value: 'Id',
};
class Select extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { zone, onZoneChange, errorText, availabledZones, dispatch, userInfo } = this.props;
        if (!availabledZones.items && !availabledZones.isFetching) {
            dispatch(fetchZones(userInfo.SelectedInventorization.Id, userInfo.Token));
        }
        return (
            <AutoComplete
                id="Zone"
                floatingLabelText="Зона"
                dataSource={availabledZones.items || []}
                searchText={zone ? zone.ZoneName : ''}
                onNewRequest={onZoneChange}
                dataSourceConfig={zoneDataSourceConfig}
                errorText={errorText} />)
    }
}

Select.propTypes = {
    zone: PropTypes.shape({
        Id: PropTypes.string.isRequired,
        Number: PropTypes.number.isRequired,
    }),
    errorText: PropTypes.string
}

export default connect(mapStateToProps)(Select)
