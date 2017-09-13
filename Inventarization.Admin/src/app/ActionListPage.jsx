/**
 * Created by Барашики on 07.04.2017.
 */
import React, { PropTypes } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Items from './containers/items'
import AllActions from './containers/allActions'
import { updateActionsFilter } from './actions/actionActions'
import { connect } from 'react-redux'
import { fetchZones } from './actions/zoneActions'
import AuthorizedComponent from './components/authorizedComponent'
import _ from 'lodash'

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    }
};

class ActionListPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const {
            userInfo,
            zones,
            dispatch } = this.props;
        if (zones == undefined) {
            dispatch(fetchZones(userInfo.SelectedInventorization.Id, userInfo.Token))
        }
    }
    render() {
        const { ZoneNumber,
            Code,
            Type
        } = this.props.location.query;
        const {
            zones,
            dispatch } = this.props;
        let foundZone = _.find(zones, z => z.Number == ZoneNumber);
        dispatch(updateActionsFilter({ Zone: foundZone, Code, Type }));
        return (
            <div>
                <h2 style={styles.headline}>Действия</h2>
                <AllActions />
            </div>
        )
    }
};

ActionListPage.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch,
        zones: state.zones.items,
    }
}

export default connect(mapStateToProps)(ActionListPage)

