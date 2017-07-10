import React, { PropTypes } from 'react';
import Form from './components/item/form'
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import { loadCurrentItem } from './actions/itemActions'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
};


class NewItemPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
   componentDidMount() {
        const { dispatch, inventorization, userInfo } = this.props
        const { id } = this.props.location.query
        if (id != undefined){
            dispatch(loadCurrentItem(id, inventorization.Id, userInfo.Token));
        }
  }
  render() {
    return (
          <div>
              <h2 style={styles.headline}>Редактирование товара</h2>
              <Form/>
          </div>
    )};
}


const mapStateToProps = (state) => {
    return {
        item : state.item,
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth,
    }
}

export default connect(mapStateToProps)(NewItemPage)