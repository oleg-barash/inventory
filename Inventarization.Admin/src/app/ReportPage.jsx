/**
 * Created by Барашики on 07.04.2017.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import AuthorizedComponent from './components/authorizedComponent'
import { fetchUsers } from './actions/userActions'
import { fetchActions } from './actions/actionActions'
import { loadINV3 } from './actions/reportActions'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    }
};

const paperStyle = {
  height: 100,
  width: 300,
  margin: 20,
  padding: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class ReportPage extends AuthorizedComponent {
    componentWillMount() {
        if (this.props.userInfo.IsInitialized()) {
            this.props.dispatch(fetchUsers(this.props.userInfo.Token))
            this.props.dispatch(fetchActions(this.props.userInfo.SelectedInventorization.Id, this.props.userInfo.Token, this.props.actions.lastUpdated))
        }
    }
    render() {
        let { users, userInfo, dispatch, report } = this.props;

        let loadINV3Handler = function(){
            dispatch(loadINV3(userInfo.SelectedInventorization.Id, userInfo.Token));
        }

        return (
            <div>
                <h2 style={styles.headline}>Отчёты</h2>
                <Tabs >
                    <Tab label="ИНВ">
                        <Paper style={paperStyle}>
                            <CircularProgress size={50} style={{display: this.props.report.BuildInProcess ? 'inline-block' : 'none'}} thickness={5}/>
                            <RaisedButton label="ИНВ-3" style={{display: this.props.report.BuildInProcess ? 'none' : 'block'}} onClick={loadINV3Handler}/>
                        </Paper>
                    </Tab>
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
        users: state.users.list,
        report: state.report,
        actions: state.actions
    }
}

export default connect(mapStateToProps)(ReportPage)
