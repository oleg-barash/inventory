import React, { PropTypes, Component } from 'react'

class Row extends Component {
    render() {
        let { company } = this.props;
        return <div>{company.Name}</div>
    }
}

Row.propTypes = {
    company: PropTypes.arrayOf(PropTypes.shape({
        Id: PropTypes.string.isRequired,
        Name: PropTypes.string.isRequired,
    }).isRequired).isRequired
}

export default Row