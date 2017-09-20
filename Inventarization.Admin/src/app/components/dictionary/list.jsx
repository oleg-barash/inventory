import React, { PropTypes, Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Row from './row';
import _ from 'lodash'

class DictionaryList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { items, actions, rests, showOnlyActive } = this.props;
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '280px' }}>Наименование</TableHeaderColumn>
                        <TableHeaderColumn>Код</TableHeaderColumn>
                        <TableHeaderColumn>Артикульный номер</TableHeaderColumn>
                        <TableHeaderColumn>Источник</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item =>  <Row item={item} key={item.Code} />)}
                </TableBody>
            </Table>
        )
    }
}


DictionaryList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        Code: PropTypes.string.isRequired
    }).isRequired).isRequired,
}

export default DictionaryList
