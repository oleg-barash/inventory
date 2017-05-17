import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Items from './containers/items'
import AllActions from './containers/allActions'
import AuthorizedComponent from './components/authorizedComponent'


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};


class ItemListPage extends AuthorizedComponent {
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Товары</h2>
              <Items/>
          </div>
    )};
}

export default ItemListPage