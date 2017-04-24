/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemList from '../components/itemList'
import { fetchItems, applyItemsFilter } from '../actions/MainActions'
import TextField from 'material-ui/TextField';

const mapStateToProps = (state) => {
    return {
        items: state.items.items,
        filter: state.items.filter,
        dispatch: state.dispatch
    }
}

class Items extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidMount() {
        this.props.dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }

    render() {
        var objectClosure = this;
        function handleCodeChange(event) {
            objectClosure.props.dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3', { Code: event.target.value}))
        };
        return (
        <div>    
            <TextField 
                id="code-filter"
                value={this.props.filter.code}
                onChange={handleCodeChange}
                hintText="Код товара"/>
            <ItemList items={this.props.items} filter={this.props.filter}/>
        </div>)
    }
}

Items.propTypes = {
    items: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Items)
