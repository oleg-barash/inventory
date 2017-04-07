/**
 * Created by Барашики on 07.04.2017.
 */
import React from 'react';
import { IndexRoute, Route }  from 'react-router';
import App from './app';
import ItemsPage from './ItemsPage.js';
import ReportPage from './ReportPage.js';
import ZonesPage from './ZonesPage.js';
import EventsPage from './EventsPage.js';
import LoginPage from './LoginPage.js';
export default (<Route path="/" component={App}>
    <div>
        <IndexRoute  component={ItemsPage}/>
        <Route path="items" component={ItemsPage}/>
        <Route path="events" component={EventsPage}/>
        <Route path="zones" component={ZonesPage}/>
        <Route path="report" component={ReportPage}/>
        <Route path="login" component={LoginPage}/>
    </div>
</Route>);