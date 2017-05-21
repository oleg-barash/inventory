/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ActionList from '../components/actionList'
import { fetchActions } from '../actions/actionActions'

const mapStateToProps = (state) => {
    return {
        inventorization: state.auth.SelectedInventorization
    }
}

class AllActionList extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch, inventorization } = this.props
        dispatch(fetchActions(inventorization.Id))
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
