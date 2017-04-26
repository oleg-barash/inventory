/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemList from '../components/itemList'
import { fetchItems, applyItemsFilter, filterItems } from '../actions/MainActions'
import TextField from 'material-ui/TextField';

const filterItemsData = (items, filter) => {
    if (items == undefined){
        return [];
    }
    var result = items;
    if (filter !== undefined){
        if (filter.text !== undefined){
            result = result.filter((item) => {
                return item.BarCode.startsWith(filter.text) 
                    || item.Number.startsWith(filter.text) 
                    || item.Description.startsWith(filter.text);
            })
        }
    }
    return result;
}

const mapStateToProps = (state) => {
    return {
        items: filterItemsData(state.items.items, state.items.filter),
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
        function handleFilterChange(event) {
            objectClosure.props.dispatch(filterItems({ text: event.target.value }))
        };
        return (
        <div>    
            <TextField 
                id="text-filter"
                value={this.props.filter.text}
                onChange={handleFilterChange}
                hintText="Поиск"/>
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
