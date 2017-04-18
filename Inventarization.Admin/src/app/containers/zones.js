/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ZoneList from '../components/zoneList'
import { fetchZones } from '../actions/MainActions'

const getZones = (items, filter) => {
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
        zones: getZones(state.zones.items, state.visibilityFilter)
    }
}

class Zones extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchZones('81d51f07-9ff3-46c0-961c-c8ebfb7b47e3'))
    }
    render() {
        return (
        <div>
            <ZoneList zones={this.props.zones}/>
        </div>)
    }
}

Zones.propTypes = {
    zones: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Zones)
