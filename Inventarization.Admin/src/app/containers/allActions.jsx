/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import List from '../components/action/list'
import { fetchActions } from '../actions/actionActions'

const mapStateToProps = (state) => {
    return {
        userInfo: state.auth,
        actions: state.actions,
    }
}

class AllActionList extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch, userInfo, actions } = this.props
        if (this.props.userInfo.SelectedInventorization != undefined)
        {
            dispatch(fetchActions(userInfo.SelectedInventorization.Id, userInfo.Token, actions.lastUpdated))
        }
    }
    render() {
        return (
        <div>
            <List/>
        </div>)
    }
}

AllActionList.propTypes = {
    dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(AllActionList)
