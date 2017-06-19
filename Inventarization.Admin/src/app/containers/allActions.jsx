/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ActionList from '../components/actionList'
import { fetchActions } from '../actions/actionActions'

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth
    }
}

class AllActionList extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch, inventorization, userInfo } = this.props
        dispatch(fetchActions(userInfo.SelectedInventorization.Id, userInfo.Token))
    }
    render() {
        return (
        <div>
            <ActionList/>
        </div>)
    }
}

AllActionList.propTypes = {
    dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(AllActionList)