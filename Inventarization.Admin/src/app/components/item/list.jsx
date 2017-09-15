/**
 * Created by Барашики on 26.03.2017.
 */
import React, { PropTypes, Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Row from './row';
import _ from 'lodash'

class List extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { items } = this.props;
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '280px' }}>Наименование</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '120px' }}>Код</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '90px' }}>Действия</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '70px' }}>Факт/План</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '100px' }}>Сумма</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {_.filter(items, x => !!x.Code).map(item => <Row item={item} key={item.Code} />)}
                </TableBody>
            </Table>
        )
    }
}


List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        Code: PropTypes.string.isRequired
    }).isRequired).isRequired,
}

export default List
