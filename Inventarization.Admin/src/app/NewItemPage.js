import React, { PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Items from './containers/items'
import ItemForm from './components/itemForm'
import AllActions from './containers/allActions'
import AuthorizedComponent from './components/authorizedComponent'
import TextField from 'material-ui/TextField';
import { setCurrentItem } from './actions/MainActions';
import { connect } from 'react-redux'


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};


class NewItemPage extends AuthorizedComponent {
  componentDidMount() {
        const { dispatch } = this.props
  }
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Добавление товара</h2>
              <ItemForm/>
          </div>
    )};
}


const mapStateToProps = (state) => {
    return {
        item : state.item
    }
}

export default connect(mapStateToProps)(NewItemPage)