import React, { PropTypes, Component  } from 'react';
import { connect } from 'react-redux'
import AutoComplete from 'material-ui/AutoComplete';
const mapStateToProps = (state) => {
    return {
        availabledZones: state.zones.items || []
    }
}
const zoneDataSourceConfig = {
  text: 'ZoneName',
  value: 'ZoneStatusId',
};
class ZoneSelect extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { zone, onZoneChange, errorText } = this.props;
        return (
            <AutoComplete 
                id="Zone"
                floatingLabelText="Зона"
                dataSource={this.props.availabledZones}
                searchText={this.props.zone ? this.props.zone.ZoneName : ''} 
                onNewRequest={onZoneChange}  
                dataSourceConfig={zoneDataSourceConfig}
                errorText={errorText}/>)
        }
}

ZoneSelect.propTypes = {
    zone: PropTypes.shape({
        Id: PropTypes.string.isRequired,
        ZoneName: PropTypes.string.isRequired,
    }),
    errorText: PropTypes.string
}

export default connect(mapStateToProps)(ZoneSelect)
