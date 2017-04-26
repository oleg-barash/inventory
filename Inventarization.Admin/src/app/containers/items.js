/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemList from '../components/itemList'
import { fetchItems, applyItemsFilter, filterItems } from '../actions/MainActions'
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const filterItemsData = (items, filter) => {
    if (items == undefined){
        return [];
    }
    var result = items;
    if (filter !== undefined){
        if (filter.Text !== undefined){
            result = result.filter((item) => {
                return item.BarCode.startsWith(filter.Text) 
                    || item.Number.startsWith(filter.Text) 
                    || item.Description.startsWith(filter.Text);
            })
        }
        if (filter.Type !== undefined){
            switch(filter.Type){
                case '1': 
                    result = result.filter((item) => item.QuantityFact < item.QuantityPlan)
                    break
                case '2': result = result.filter((item) => item.QuantityFact > item.QuantityPlan)
                    break
                default:
                    break
            }

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
const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};
class Items extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidMount() {
        this.props.dispatch(fetchItems('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }

    render() {
        var objectClosure = this;
        function handleFilterChange(event, value) {
            objectClosure.props.dispatch(filterItems({ Text: event.target.value }))
        };
        function handleStateChange(event, value) {
            objectClosure.props.dispatch(filterItems({ Type: value }))
        };
        
        return (
        <div>    
            <TextField 
                id="text-filter"
                value={this.props.filter.text}
                onChange={handleFilterChange}
                hintText="Поиск"/>

            <RadioButtonGroup name="itemState" defaultSelected="0" onChange={handleStateChange}>
                <RadioButton
                    value="0"
                    label="Показывать все"
                    style={styles.radioButton}
                />
                <RadioButton
                    value="1"
                    label="Показать недостачу"
                    style={styles.radioButton}
                />
                <RadioButton
                    value="2"
                    label="Показать избытки"
                    style={styles.radioButton}
                />
            </RadioButtonGroup>
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
