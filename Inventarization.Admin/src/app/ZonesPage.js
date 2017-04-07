import React from 'react';
import Zones from './containers/zones'
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
              <h2 style={styles.headline}>Зоны</h2>
              <Zones/>
          </div>
    )};

export default ItemsPage