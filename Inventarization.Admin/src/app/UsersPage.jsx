import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Users from './components/user/userList'
import { fetchUsers } from './actions/userActions'
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        dispatch: state.dispatch,
        users: state.users
    }
}


class UsersPage extends AuthorizedComponent {
  constructor(props) {
      super(props);
  }
    componentWillMount() {
        if (this.props.userInfo.IsInitialized()){
            this.props.dispatch(fetchUsers(this.props.userInfo.Token))
        }
    }
  render() {
    let { users } = this.props;
    return (
          <div>
              <h2 style={styles.headline}>Пользователи</h2>
              <Users users={users.list}/>
          </div>
    )};
}

export default connect(mapStateToProps)(UsersPage)