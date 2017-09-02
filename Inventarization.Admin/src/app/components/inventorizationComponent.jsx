import { connect } from 'react-redux'
import AuthorizedComponent from './authorizedComponent'
import { closeInventorizationDialog, openInventorizationDialog } from '../actions/authorizationActions'
class InventorizationComponent extends AuthorizedComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { userInfo, dispatch } = this.props;
    if (userInfo.SelectedInventorization === undefined) {
      dispatch(openInventorizationDialog());
    }
    else{
      dispatch(closeInventorizationDialog());
    }
  }
}
export default InventorizationComponent