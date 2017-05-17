import React, { PropTypes } from 'react';
import ActionForm from './components/actionForm'
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
  componentDidMount() {
        const { dispatch } = this.props
        const { id } = this.props.location.query
        dispatch(loadCurrentAction(id));
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
        action : state.action
    }
}

export default connect(mapStateToProps)(ActionPage)