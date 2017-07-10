import React, { PropTypes } from 'react';
import ActionForm from './components/action/form'
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import { loadCurrentAction } from './actions/actionActions'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};


class ActionPage extends AuthorizedComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
        const { dispatch, userInfo } = this.props
        const { id } = this.props.location.query
        if (id !== undefined){
            dispatch(loadCurrentAction(id, userInfo.Token));
        }
  }
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Действие</h2>
              <ActionForm/>
          </div>
    )};
}


const mapStateToProps = (state) => {
    return {
        action : state.action,
        userInfo: state.auth
    }
}

export default connect(mapStateToProps)(ActionPage)