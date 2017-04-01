import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import AllActionList from './containers/allActions'


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
      <Tab label="Позиции" >
          <div>
              <h2 style={styles.headline}>Позиции</h2>
              <AllActionList/>
          </div>
      </Tab>
    <Tab label="Зоны" >
      <div>
        <h2 style={styles.headline}>Зоны</h2>
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