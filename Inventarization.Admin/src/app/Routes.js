/**
 * Created by Барашики on 07.04.2017.
 */
import React from 'react';
import { IndexRoute, Route }  from 'react-router';
import App from './app';
import ItemListPage from './ItemListPage.js';
import ItemPage from './ItemPage.js';
import ReportPage from './ReportPage.js';
import ZonesPage from './ZonesPage.js';
import ActionListPage from './ActionListPage.js';
import LoginPage from './LoginPage.js';
import ActionPage from './ActionPage.js';
export default (<Route path="/" component={App}>
    <div>
        <IndexRoute  component={ItemListPage}/>
        <Route path="items" component={ItemListPage}/>
        <Route path="editItem" component={ItemPage}/>
        <Route path="editAction" component={ActionPage}/>
        <Route path="actions" component={ActionListPage}/>
        <Route path="zones" component={ZonesPage}/>
        <Route path="report" component={ReportPage}/>
        <Route path="login" component={LoginPage}/>
    </div>
</Route>);