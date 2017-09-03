/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Row from '../../components/zone/row';

class List extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let { zones } = this.props;
        return (<Table>
        <TableBody>
            {zones ? zones.map(zone =>
                <Row zone={zone} key={zone.ZoneStatusId}/>
            ) : null}
        </TableBody>
    </Table>)
    }
}


List.propTypes = {
    zones: PropTypes.arrayOf(PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default List
