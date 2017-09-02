import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Items from './containers/items'
import AllActions from './containers/allActions'
import InventorizationComponent from './components/inventorizationComponent'
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
        dispatch: state.dispatch
    }
}


class ItemListPage extends InventorizationComponent {
  constructor(props) {
      super(props);
  }
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Товары</h2>
              <Items/>
          </div>
    )};
}

export default connect(mapStateToProps)(ItemListPage)