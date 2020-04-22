'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class addTenantComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let loginObject = this.UIObjects.loginObject;
        let peoplesTabObject = this.UIObjects.peoplesTabObject;
        let leaseObject = this.UIObjects.leaseObject;
         

        // UI objects with initialization
        this.spanNameHolder = Selector(loginObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.search = Selector(loginObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(loginObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(loginObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresultsTenant = Selector(peoplesTabObject.data.data.pages.login.uiobjects.propertyresultsTenant.selector);
        this.peoplesTab = Selector(peoplesTabObject.data.data.pages.login.uiobjects.peoplesTab.selector);  

        this.tenantTab = Selector(peoplesTabObject.data.data.pages.login.uiobjects.tenantTab.selector);   
        this.addTenant = Selector(peoplesTabObject.data.data.pages.login.uiobjects.addTenant.selector);    
        this.email = Selector(peoplesTabObject.data.data.pages.login.uiobjects.email.selector);    
        this.addnewemail = Selector(peoplesTabObject.data.data.pages.login.uiobjects.addnewemail.selector); 
        this.tenantName = Selector(peoplesTabObject.data.data.pages.login.uiobjects.tenantName.selector); 
        this.mobileNo = Selector(peoplesTabObject.data.data.pages.login.uiobjects.mobileNo.selector); 
        this.saveButton = Selector(peoplesTabObject.data.data.pages.login.uiobjects.saveButton.selector); 
        this.leaseSelector = Selector(peoplesTabObject.data.data.pages.login.uiobjects.leaseSelector.selector);
        this.leaseoptions = Selector(peoplesTabObject.data.data.pages.login.uiobjects.leaseoptions.selector); 
        this.searchClose = Selector(leaseObject.data.data.pages.login.uiobjects.searchClose.selector);
                        
        this.execute = this.execute.bind(this);

    }
    async execute(data) {

       // const leaseSelector = Selector('#differentApp > div > div.content-dock > div > div.col.dashboard-content-area > div > div:nth-child(6) > form > div > div.person-role-form > div:nth-child(1) > div:nth-child(2) > select');
       await t

        .click(this.search)
        .typeText(this.search, data.propertyname)
        .click(this.propertyresultsTenant)
        .click(this.peoplesTab)
        .click(this.tenantTab)
        .wait(3000)
        .click(this.addTenant)

        .click(this.email)
        .typeText(this.email, data.email)
        .click(this.addnewemail)

        .typeText(this.tenantName, data.tenantname)

        .click(this.leaseSelector)
        .click(this.leaseoptions)

        .typeText(this.mobileNo, data.mobileno)
        .click(this.saveButton)
        .wait(5000)
        .click(this.searchClose);

       // .click(this.paymenttab);

    }

}
module.exports = addTenantComponent;