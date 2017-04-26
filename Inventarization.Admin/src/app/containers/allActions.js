/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ActionList from '../components/actionList'
import { fetchActions } from '../actions/MainActions'

const getActions = (actions, filter) => {
    if (actions == undefined){
        return [];
    }
    var result = actions;
    if (filter !== undefined){
        if (filter.Code !== undefined){
            result = result.filter((item) => {
                return item.BarCode.startsWith(filter.Code);
            })
        }
    }
    return result;
}

const mapStateToProps = (state) => {
    return {
        actions: getActions(state.actions.items, state.actions.filter)
    }
}

class AllActionList extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchActions('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }
    render() {
        return (
        <div>
            <ActionList actions={this.props.actions}/>
        </div>)
    }
}

AllActionList.propTypes = {
    dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(AllActionList)
