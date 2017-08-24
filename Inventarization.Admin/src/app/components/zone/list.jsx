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
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn style={{ width: '30px'}}>Зона</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '50px' }}>Способ пересчёта</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '40px' }}>Количество</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '100px' }}>Открыто</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '100px' }}>Закрыто</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '100px' }}>Закрыто</TableHeaderColumn>
            </TableRow>
        </TableHeader>
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
