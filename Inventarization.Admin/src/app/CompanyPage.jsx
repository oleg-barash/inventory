import React from 'react';
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import Form from './components/company/form'
import { loadCompanyInfo } from './actions/companyActions'
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
        company: state.company
    }
}

class CompanyPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { dispatch, userInfo } = this.props
        const { id } = this.props.location.query
        if (id !== undefined) {
            dispatch(loadCompanyInfo(id, userInfo.Token));
        }
    }
    render() {
        const { company } = this.props
        return (
            <div>
                <h2 style={styles.headline}>Карточка компании</h2>
                {!!company.company ? <Form company={company.company}/> : null}
            </div>
        )
    }
};

export default connect(mapStateToProps)(CompanyPage)