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

const Main = () => {
    return (
  <Tabs>
      <Tab label="Товары" >
          <div>
              <h2 style={styles.headline}>Товары</h2>
              <Items/>
          </div>
      </Tab>
    <Tab label="События" >
      <div>
        <h2 style={styles.headline}>События</h2>
        <AllActions/>
      </div>
    </Tab>
    <Tab label="Отчёты">
      <div>
        <h2 style={styles.headline}>Отчёты</h2>
      </div>
    </Tab>
  </Tabs>
)};

export default Main