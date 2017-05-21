/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ZoneList from '../components/zoneList'
import { fetchZones } from '../actions/zoneActions'

const mapStateToProps = (state) => {
    return {
        zones: state.zones.items,
        inventorization: state.auth.SelectInventorization
    }
}

class Zones extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch, inventorization } = this.props
        dispatch(fetchZones(inventorization.Id))
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
