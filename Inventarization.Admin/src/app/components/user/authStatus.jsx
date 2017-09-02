import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import LoginButton from './loginButton';
import LoggedButton from './loggedButton';
import AuthorizedComponent from '../authorizedComponent'
import InventorizationSelect from '../inventorizationSelect'
import { setInventorization } from '../../actions/authorizationActions'

import { fetchActions } from '../../actions/actionActions'
import { fetchItems } from '../../actions/dictionaryActions'
import { fetchRests } from '../../actions/restsActions'
import { fetchZones } from '../../actions/zoneActions'



const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}
class AuthStatus extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    render() {
        let { userInfo, dispatch } = this.props;
        function inventorizationSelected(event, target, value) {
            dispatch(setInventorization(value))
            dispatch(fetchActions(value.Id, userInfo.Token));
            dispatch(fetchItems(value.Company, {}, userInfo.Token));
            dispatch(fetchRests(value.Id, userInfo.Token));
            dispatch(fetchZones(value.Id, userInfo.Token));
            
        }
        if (userInfo && userInfo.IsAuthorized) {
            return (
                <div>
                    <InventorizationSelect cookies={this.props.cookies} onInventorizationChanged={inventorizationSelected} />
                    <LoggedButton cookies={this.props.cookies} />
                </div>

            );
        }
        return (<LoginButton />);
    }
}

export default connect(mapStateToProps)(AuthStatus)