import React, {Component} from 'react';
import AuthorizedComponent from './authorizedComponent'
import InventorizationSelect from './inventorizationSelect'
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog';
import { closeInventorizationDialog, setInventorization } from '../actions/authorizationActions'

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
    }
}

class InventorizationDialog extends AuthorizedComponent {
    constructor(props) {
      super(props);
    }
    render(){
        let { userInfo, dispatch } = this.props;
        function handleClose () {
            dispatch(closeInventorizationDialog())
        }

        function inventorizationSelected(event, target, value){
            dispatch(setInventorization(value))
        }
        return userInfo === undefined || userInfo.Token === undefined || userInfo.SelectedInventorization !== undefined ? null : (<Dialog title="Выбор инвентаризации"
                    actions={<FlatButton
                        label="Готово"
                        disabled={userInfo.SelectedInventorization === undefined}
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={handleClose}
                    />}
                    modal={true}
                    open={userInfo.isInventorizationDialogOpened}
                    onRequestClose={handleClose}>
                        Для продолжения работы выберите инвентаризацию
                    <InventorizationSelect cookies={this.props.cookies} onInventorizationChanged={inventorizationSelected}/>
            </Dialog>)
    }
}

export default connect(mapStateToProps)(InventorizationDialog)