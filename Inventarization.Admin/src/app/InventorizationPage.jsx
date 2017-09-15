import React from 'react';
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import Form from './components/inventorization/form'
import { loadInventorizationInfo } from './actions/inventorizationActions'
import moment from 'moment';
const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    }
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        inventorization: state.inventorization.inventorization
    }
}

class InventorizationPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { dispatch, userInfo, inventorization } = this.props
        const { id, companyId } = this.props.location.query
        debugger
        if (inventorization == undefined && id !== undefined) {
            dispatch(loadInventorizationInfo(id, userInfo.Token));
        }
        return (
            <div>
                <h2 style={styles.headline}>Карточка инверторизации</h2>
                <Form inventorization={inventorization} companyId={companyId}/>
            </div>
        )
    }
};

export default connect(mapStateToProps)(InventorizationPage)