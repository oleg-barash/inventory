/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ZoneRow from '../components/zoneRow';

class ZoneList extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let { zones } = this.props;
        return (<Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn style={{width: '100px'}}>Зона</TableHeaderColumn>
                <TableHeaderColumn style={{width: '100px'}}>Время открытия</TableHeaderColumn>
                <TableHeaderColumn style={{width: '100px'}}>Время закрытия</TableHeaderColumn>
                <TableHeaderColumn>Действия</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {zones.map(zone =>
                <ZoneRow zone={zone} key={zone.ZoneStatusId}/>
            )}
        </TableBody>
    </Table>)
    }
}


ZoneList.propTypes = {
    zones: PropTypes.arrayOf(PropTypes.shape({
        ZoneStatusId: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default ZoneList
