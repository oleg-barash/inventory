import React, { Component }  from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux'
import { CLOSE_DRAWER } from '../../constants/actionTypes'
import { Link } from 'react-router'

class LeftMenu extends Component{
        constructor(props) {
        super(props);
    }
    render() {
        let { opened, dispatch } = this.props;
        return (
            <Drawer open={opened} docked={false} onRequestChange={(open) => dispatch({ type: CLOSE_DRAWER })}>
                <MenuItem><Link to="/items" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Товары</Link></MenuItem>
                <MenuItem><Link to="/actions" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Действия</Link></MenuItem>
                <MenuItem><Link to="/zones" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Зоны</Link></MenuItem>
                <MenuItem><Link to="/users" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Пользователи</Link></MenuItem>
                <MenuItem><Link to="/reports" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Отчёты</Link></MenuItem>
                <MenuItem><Link to="/companies" onClick={(open) => dispatch({ type: CLOSE_DRAWER })}>Компании</Link></MenuItem>
            </Drawer>)
    }
}

let mapState = function(state){
    return {
        opened: state.global.DrawerIsOpened
    }
}

export default connect(mapState)(LeftMenu)

