import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Items from './containers/items'
import AllActions from './containers/allActions'


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};

const ItemsPage = () => {
    return (
          <div>
              <h2 style={styles.headline}>Товары</h2>
              <Items/>
          </div>
    )};

export default ItemsPage