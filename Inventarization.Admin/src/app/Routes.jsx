/**
 * Created by Барашики on 07.04.2017.
 */
import React from 'react';
import { IndexRoute, Route }  from 'react-router';
import App from './app';
import ItemListPage from './ItemListPage';
import ItemPage from './ItemPage';
import ReportPage from './ReportPage';
import ZonesPage from './ZonesPage';
import ActionListPage from './ActionListPage';
import LoginPage from './LoginPage';
import ActionPage from './ActionPage';
import UsersPage from './UsersPage'
export default (<Route path="/" component={App}>
    <div>
        <IndexRoute  component={LoginPage}/>
        <Route path="items" component={ItemListPage}/>
        <Route path="editItem" component={ItemPage}/>
        <Route path="editAction" component={ActionPage}/>
        <Route path="actions" component={ActionListPage}/>
        <Route path="zones" component={ZonesPage}/>
        <Route path="report" component={ReportPage}/>
        <Route path="login" component={LoginPage}/>
        <Route path="users" component={UsersPage}/>
    </div>
</Route>);