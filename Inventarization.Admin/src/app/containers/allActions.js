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
     switch (filter) {
         case 'SHOW_ALL':
            return actions;
         case 'SHOW_COMPLETED':
             return actions.filter(t => t.completed)
         case 'SHOW_ACTIVE':
             return actions.filter(t => !t.completed)
         default:
             return actions;
    }
}

const mapStateToProps = (state) => {
    return {
        actions: getActions(state.actions.items, state.visibilityFilter)
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
