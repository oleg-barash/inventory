/**
 * Created by Барашики on 01.04.2017.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import List from '../components/zone/list'
import { fetchZones } from '../actions/zoneActions'

const mapStateToProps = (state) => {
    return {
        zones: state.zones.items,
        inventorization: state.auth.SelectedInventorization,
        userInfo: state.auth
    }
}

class Zones extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch, inventorization, userInfo } = this.props
        dispatch(fetchZones(inventorization.Id, userInfo.Token))
    }
    render() {
        return (
        <div>
            <List zones={this.props.zones}/>
        </div>)
    }
}

Zones.propTypes = {
    zones: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Zones)
