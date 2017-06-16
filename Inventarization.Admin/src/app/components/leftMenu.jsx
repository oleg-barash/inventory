import React, { Component }  from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux'
import { CLOSE_DRAWER } from '../constants/actionTypes'
import { Link } from 'react-router'

class LeftMenu extends Component{
        constructor(props) {
        super(props);
    }
    render() {
        let { opened, dispatch } = this.props;
        return (
            <Drawer open={opened} docked={false} onRequestChange={(open) => dispatch({ type: CLOSE_DRAWER })}>
                <MenuItem><Link to="/items">Товары</Link></MenuItem>
                <MenuItem><Link to="/actions">Действия</Link></MenuItem>
                <MenuItem><Link to="/zones">Зоны</Link></MenuItem>
                <MenuItem><Link to="/users">Пользователи</Link></MenuItem>
                <MenuItem><Link to="/reports">Отчёты</Link></MenuItem>
            </Drawer>)
    }
}

let mapState = function(state){
    return {
        opened: state.global.DrawerIsOpened
    }
}

export default connect(mapState)(LeftMenu)

