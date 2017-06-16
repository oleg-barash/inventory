/**
 * Created by Барашики on 07.04.2017.
 */
import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Items from './containers/items'
import AllActions from './containers/allActions'
import { updateActionsFilter } from './actions/actionActions'
import { connect } from 'react-redux'

import AuthorizedComponent from './components/authorizedComponent'


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
        const { ZoneName, Code } = this.props.location.query
        this.props.dispatch(updateActionsFilter({ZoneName, Code}))
    }
    render() {
        return (
            <div>
                <h2 style={styles.headline}>Действия</h2>
                <AllActions/>
            </div>
        )}
};

ActionListPage.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch
    }
}

export default connect(mapStateToProps)(ActionListPage)

