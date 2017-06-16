import React from 'react';
import Zones from './containers/zones'
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
        item : state.item,
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth,
    }
}

class ZonesPage extends AuthorizedComponent {
      render() {
    return (
          <div>
              <h2 style={styles.headline}>Зоны</h2>
              <Zones/>
          </div>
    )}};

export default connect(mapStateToProps)(ZonesPage)