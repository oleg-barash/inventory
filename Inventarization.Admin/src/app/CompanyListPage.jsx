import React from 'react';
import Companies from './components/company/list'
import AuthorizedComponent from './components/authorizedComponent'
import { connect } from 'react-redux'
import { loadCompanies } from './actions/companyActions'
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
        companies: state.company.list
    }
}

class CompanyListPage extends AuthorizedComponent {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        let { dispatch, userInfo, companies } = this.props;
        dispatch(loadCompanies(userInfo.Token))
    }
    render() {
        let { companies } = this.props;
        return (
            <div>
                <h2 style={styles.headline}>Компании</h2>
                { !!companies ? <Companies companies={companies}/> : null }
            </div>
        )
    }
};

export default connect(mapStateToProps)(CompanyListPage)