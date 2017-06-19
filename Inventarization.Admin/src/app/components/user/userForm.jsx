import React, { PropTypes, Component  } from 'react';
import { green100 as green}  from 'material-ui/styles/colors';
import { yellow100 as yellow}  from 'material-ui/styles/colors';
import { red100 as red}  from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import { saveUser, validateUser, loadUser } from '../../actions/userActions'
const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        user: state.user
    }
}

class UserForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { dispatch, userInfo, user } = this.props;

        let { id } = this.props.location.query;
        if (id !== undefined && (user == null || user.Id != id)){
            dispatch(loadUser(id, userInfo.Token));
        }
        let goBack = function() {
            browserHistory.goBack();
        }
        let save = function() {
            if (!!user.Login){
                dispatch(saveUser(user, userInfo.Token));
            }
            else{
                dispatch(validateUser({Login: user.Login || ''}));
            }
        }
        return (
            <Paper>
                <TextField id="Login" value={user.Login} floatingLabelText="user_the_first" errorText={user != null ? user.LoginError || '' : '' }/>
                <Divider />
                <FlatButton label="Назад" onClick={goBack} />
                <FlatButton label="Сохранить" onClick={save} disabled={ !!user.LoginError } />
            </Paper>)
    }
}

export default connect(mapStateToProps)(UserForm)