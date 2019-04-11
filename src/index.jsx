import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Toastr from 'toastr';

import AddPerson from './pages/add-person/index.jsx';
import AuthenticatedApp from './pages/AuthenticatedApp/index.jsx'
import AddProperty from './pages/add-property/index.jsx';
import Login from './pages/login/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import ViewPerson from './pages/view-person/index.jsx';
import ViewProperty from './pages/view-property/index.jsx';
import Settings from './pages/setting/index.jsx';
import LoginActions from './actions/LoginActions.js';

import DashboardProperties from './pages/Dashboard/Properties/index.jsx';
import DashboardMaintenance from './pages/Dashboard/Maintenance/index.jsx';
import DashboardRenewals from './pages/Dashboard/Renewals/index.jsx';
import DashboardReports from './pages/Dashboard/Renewals/index.jsx';
import HoldingDeposit from './pages/Dashboard/HoldingDeposits/index.jsx';
import Transactions from './pages/Dashboard/Transactions';

import ViewPropertyProperty from './pages/view-property/Property/index.jsx';
import ViewPropertyDocument from './pages/view-property/Documents/index.jsx';
import ViewPropertyInspection from './pages/view-property/Inspections/index.jsx';
import ViewPropertyKeys from './pages/view-property/Keys/index.jsx';
import ViewPropertyMaintenance from './pages/view-property/Maintenance/index.jsx';
import ViewPropertyMessage from './pages/view-property/Messages/index.jsx';
import ViewPropertyPayment from './pages/view-property/Payments/index.jsx';
import ViewPropertyPeople from './pages/view-property/People/index.jsx';
import ViewPropertyPicture from './pages/view-property/Pictures/index.jsx';
import ViewPropertyTakeover from './pages/view-property/Takeover/index.jsx';
import ViewPropertyVacancy from './pages/view-property/Vacancy/index.jsx';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Loading toastr styles
import 'toastr/toastr.scss';
// Loading flexboxgrid styles
import 'flexboxgrid';
// Loading icofonts
import './assets/fonts/icofont/css/icofont.css';
// Loading basic styles
import './assets/styles/index.scss';

// Material Ui Theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green900, green700, greenA700,
    pinkA200, fullWhite,
    grey100, grey300, grey500,
    white, darkBlack, fullBlack} from 'material-ui/styles/colors';

// Toastr config
Toastr.options.timeOut = 2000;
Toastr.options.positionClass="toast-top-full-width";

//Customization for different theme
const differentTheme = getMuiTheme({
    palette: {
        primary1Color: green900,
        primary2Color: green700,
        primary3Color: greenA700,
        accent1Color: pinkA200,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        pickerHeaderColor: green900,
        shadowColor: fullBlack,
    },
    appBar: {
        color: fullWhite
    },
});


let jwt = localStorage.getItem('jwt');
if (jwt) {
    LoginActions.loginUser(jwt);
}

const routes = (
    <Route component={AuthenticatedApp}>
        <Route path="add-person" component={AddPerson}/>
        <Route path="add-property" component={AddProperty}/>
        <Route path="view-person/:id" component={ViewPerson}/>
        <Route path="view-person/:id/:type" component={ViewPerson}/>
        <Route path="view-property/:id" component={ViewProperty}>
            <IndexRoute component={ViewPropertyTakeover}/>
            <Route path="document" component={ViewPropertyDocument}/>
            <Route path="inspection" component={ViewPropertyInspection}/>
            <Route path="key" component={ViewPropertyKeys}/>
            <Route path="maintenance" component={ViewPropertyMaintenance}/>
            <Route path="message" component={ViewPropertyMessage}/>
            <Route path="payment" component={ViewPropertyPayment}/>
            <Route path="people" component={ViewPropertyPeople}/>
            <Route path="picture" component={ViewPropertyPicture}/>
            <Route path="vacancy" component={ViewPropertyVacancy}/>
            <Route path="takeover" component={ViewPropertyTakeover}/>
            <Route path="property" component={ViewPropertyProperty}/>
        </Route>
        <Route path="/"  component={Dashboard}>
            <IndexRoute component={DashboardProperties}/>
            <Route path="/maintenance" component={DashboardMaintenance}/>
            <Route path="/renewals" component={DashboardRenewals}/>
            <Route path="/reports" component={DashboardReports}/>
            <Route path="/reports/:report" component={DashboardReports}/>
            <Route path="/reports/:report/:map" component={DashboardReports}/>
            <Route path="/transactions" component={Transactions}/>
            <Route path="/holdings" component={HoldingDeposit}/>
        </Route>
        <Route path="login" component={Login}/>

        <Route path="setting" component={Settings}/>
    </Route>
);

window.addEventListener('build', function (e) {
    ReactDom.render(
    <MuiThemeProvider muiTheme={differentTheme}><Router history={hashHistory} routes={routes}/>
    </MuiThemeProvider>, document.getElementById('differentApp')) ;
 });
