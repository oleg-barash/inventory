import React from 'react';
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import Form from './components/inventorization/form'
import { loadInventorizationInfo } from './actions/inventorizationActions'
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
        inventorization: state.inventorization
    }
}

class InventorizationPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { dispatch, userInfo } = this.props
        const { id } = this.props.location.query
        if (id !== undefined) {
            dispatch(loadInventorizationInfo(id, userInfo.Token));
        }
    }
    render() {
        const { inventorization } = this.props
        return (
            <div>
                <h2 style={styles.headline}>Карточка инверторизации</h2>
                {!!inventorization.inventorization ? <Form inventorization={inventorization.inventorization}/> : null}
            </div>
        )
    }
};

export default connect(mapStateToProps)(InventorizationPage)