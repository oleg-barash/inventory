import React, { PropTypes } from 'react';
import ItemForm from './components/itemForm'
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