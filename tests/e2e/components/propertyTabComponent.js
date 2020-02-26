/**
 * @file propertyTabComponent
 * @author Milroy Perera
 */
'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';
import BaseComponent from './BaseComponent';
import config from '../libs/helpers/configHelper';

class propertyTabComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let propertyTabObject = this.UIObjects.propertyTabObject;
        let loginObject = this.UIObjects.loginObject;

        // UI objects with initialization
        this.search = Selector(loginObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(loginObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(loginObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(loginObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(loginObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        
        this.propertyTab = Selector(propertyTabObject.data.data.pages.login.uiobjects.propertyTab.selector);
        this.editbutton = Selector(propertyTabObject.data.data.pages.login.uiobjects.editbutton.selector);
        this.salePrice = Selector(propertyTabObject.data.data.pages.login.uiobjects.salePrice.selector);
        this.Bedroom = Selector(propertyTabObject.data.data.pages.login.uiobjects.Bedroom.selector);
        this.Bathroom = Selector(propertyTabObject.data.data.pages.login.uiobjects.Bathroom.selector);
        this.Parking = Selector(propertyTabObject.data.data.pages.login.uiobjects.Parking.selector);
        this.Type = Selector(propertyTabObject.data.data.pages.login.uiobjects.Type.selector);
        this.SwimmingPoolYes = Selector(propertyTabObject.data.data.pages.login.uiobjects.SwimmingPoolYes.selector);
        this.SwimmingPoolNo = Selector(propertyTabObject.data.data.pages.login.uiobjects.SwimmingPoolNo.selector);
        this.StrataManagedYes = Selector(propertyTabObject.data.data.pages.login.uiobjects.StrataManagedYes.selector);
        this.StrataManagedNo = Selector(propertyTabObject.data.data.pages.login.uiobjects.StrataManagedNo.selector);
        this.PreviousPropertyManagerYes = Selector(propertyTabObject.data.data.pages.login.uiobjects.PreviousPropertyManagerYes.selector);
        this.PreviousPropertyManagerNo = Selector(propertyTabObject.data.data.pages.login.uiobjects.PreviousPropertyManagerNo.selector);
        this.WaterEfficiencyDevicesYes  = Selector(propertyTabObject.data.data.pages.login.uiobjects.WaterEfficiencyDevicesYes.selector);
        this.WaterEfficiencyDevicesNo = Selector(propertyTabObject.data.data.pages.login.uiobjects.WaterEfficiencyDevicesNo.selector);
        this.WaterSeparatelyMeteredYes = Selector(propertyTabObject.data.data.pages.login.uiobjects.WaterSeparatelyMeteredYes.selector);
        this.WaterSeparatelyMeteredNo = Selector(propertyTabObject.data.data.pages.login.uiobjects.WaterSeparatelyMeteredNo.selector);
        this.BuiltBefore1980 = Selector(propertyTabObject.data.data.pages.login.uiobjects.BuiltBefore1980.selector);
        this.BuiltBefore1980No = Selector(propertyTabObject.data.data.pages.login.uiobjects.BuiltBefore1980No.selector);
        this.HasTenantAtManagementStart = Selector(propertyTabObject.data.data.pages.login.uiobjects.HasTenantAtManagementStart.selector);
        this.NoTenantAtManagementStart = Selector(propertyTabObject.data.data.pages.login.uiobjects.NoTenantAtManagementStart.selector);

        this.execute = this.execute.bind(this);

    }
    async execute(data) {

        await t
            .click(this.search)
            .typeText(this.search, data.propertyname)
            .wait(3000)
            .click(this.propertyresults)

            .click(this.propertyTab)
            .click(this.editbutton)

           // .typeText(this.salePrice, data.salePrice)
          //  .click(this.savebutton)

    }

}
module.exports = propertyTabComponent;