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
        var { items, actions, rests } = this.props;
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '280px' }}>Наименование</TableHeaderColumn>
                        <TableHeaderColumn>Код</TableHeaderColumn>
                        <TableHeaderColumn>Зоны</TableHeaderColumn>
                        <TableHeaderColumn>Факт/План</TableHeaderColumn>
                        <TableHeaderColumn>Сумма</TableHeaderColumn>
                        <TableHeaderColumn>Действия</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => {
                        var itemRests = _.find(rests, (rest) => rest.Code === item.Code);
                        var itemActions = _.filter(actions, (action) => action.BarCode === item.Code);
                        if (itemRests != undefined || _.size(itemActions) > 0){
                            return <Row item={item} rests={itemRests} actions={itemActions} key={item.Code} />
                        }
                        return null;
                    })}
                </TableBody>
            </Table>
        )
    }
}


List.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        Code: PropTypes.string.isRequired
    }).isRequired).isRequired,
    filter: PropTypes.object,
    rests:  PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.arrayOf(PropTypes.object)
}

export default List
