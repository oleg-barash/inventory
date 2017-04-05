/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemList from '../components/itemList'
import { fetchItems } from '../actions/MainActions'

const getItems = (items, filter) => {
    // switch (filter) {
    //     case 'SHOW_ALL':
            return items;
        // case 'SHOW_COMPLETED':
        //     return actions.filter(t => t.completed)
        // case 'SHOW_ACTIVE':
        //     return actions.filter(t => !t.completed)
    //}
}

const mapStateToProps = (state) => {
    return {
        items: getItems(state.items.items, state.visibilityFilter)
    }
}

class Items extends Component {
    constructor(props) {
        super(props)
        // this.handleChange = this.handleChange.bind(this)
        // this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }
    // componentDidUpdate() {
    //     const { dispatch } = this.props
    //     dispatch(fetchActions('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    // }
    render() {
        return (
        <div>
            <ItemList items={this.props.items}/>
        </div>)
    }
}

Items.propTypes = {
    items: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Items)
