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
import UsersPage from './UsersPage';
import CompanyPage from './CompanyPage';
import InventorizationPage from './InventorizationPage';
import CompanyListPage from './CompanyListPage';
import UserForm from './components/user/userForm';
export default (<Route path="/" component={App}>
    <div>
        <IndexRoute  component={LoginPage}/>
        <Route path="items" component={ItemListPage}/>
        <Route path="editItem" component={ItemPage}/>
        <Route path="editAction" component={ActionPage}/>
        <Route path="actions" component={ActionListPage}/>
        <Route path="zones" component={ZonesPage}/>
        <Route path="reports" component={ReportPage}/>
        <Route path="login" component={LoginPage}/>
        <Route path="users" component={UsersPage}/>
        <Route path="editUser" component={UserForm}/>
        <Route path="newUser" component={UserForm}/>
        <Route path="companies" component={CompanyListPage}/>
        <Route path="editCompany" component={CompanyPage}/>
        <Route path="editInventorization" component={InventorizationPage}/>
    </div>
</Route>);
