/**
 * Created by Барашики on 07.04.2017.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import AuthorizedComponent from './components/authorizedComponent'
import { fetchUsers } from './actions/userActions'
import { fetchActions } from './actions/actionActions'

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    }
};

class ReportPage extends AuthorizedComponent {
    componentWillMount() {
        if (this.props.userInfo.IsInitialized()) {
            this.props.dispatch(fetchUsers(this.props.userInfo.Token))
            this.props.dispatch(fetchActions(this.props.userInfo.SelectedInventorization.Id, this.props.userInfo.Token))
        }
    }
    render() {
        let { users } = this.props;
        return (
            <div>
                <h2 style={styles.headline}>Отчёты</h2>
                <Tabs >
                    <Tab label="Сотрудники">
                        <ul>
                            {
                                users.map(user => {
                                    return <li user={user} key={user.Login}>{user.Login}</li>
                                })
                            }
                        </ul>
                    </Tab>
                </Tabs>
            </div>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch,
        users: state.users.list
    }
}

export default connect(mapStateToProps)(ReportPage)
