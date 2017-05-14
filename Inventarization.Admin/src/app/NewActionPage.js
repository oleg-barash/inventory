import React, { PropTypes } from 'react';
import ActionForm from './components/actionForm'
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


class NewActionPage extends AuthorizedComponent {
  componentDidMount() {
        const { dispatch } = this.props
  }
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Добавление действия</h2>
              <ActionForm/>
          </div>
    )};
}


const mapStateToProps = (state) => {
    return {
        action : state.action
    }
}

export default connect(mapStateToProps)(NewActionPage)