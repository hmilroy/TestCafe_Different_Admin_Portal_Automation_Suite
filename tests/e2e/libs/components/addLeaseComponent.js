/**
 * @file Login Component.
 */
'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';
import BaseComponent from './BaseComponent';
import config from '../helpers/configHelper';
import { Input } from 'antd';
import { Divider } from 'material-ui';

class addLeaseComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let leaseObject = this.UIObjects.leaseObject;
//roy
        // UI objects with initialization
        this.buttonSignInWithGoogle = Selector(leaseObject.get('data.pages.login.uiobjects.buttonSignInWithGoogle.selector'));
        this.inputEmail = Selector(leaseObject.data.data.pages.login.uiobjects.inputEmail.selector);
        this.inputPassword = Selector(leaseObject.data.data.pages.login.uiobjects.inputPassword.selector);
        this.spanNameHolder = Selector(leaseObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.search = Selector(leaseObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(leaseObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(leaseObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(leaseObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(leaseObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        this.paymenttab = Selector(leaseObject.data.data.pages.login.uiobjects.paymenttab.selector);
        this.addlease = Selector(leaseObject.data.data.pages.login.uiobjects.addlease.selector);
        this.fixedlease = Selector(leaseObject.data.data.pages.login.uiobjects.fixedlease.selector);
        this.periodiclease = Selector(leaseObject.data.data.pages.login.uiobjects.periodiclease.selector);
        this.rentamount = Selector(leaseObject.data.data.pages.login.uiobjects.rentamount.selector);
        this.leasestart = Selector(leaseObject.data.data.pages.login.uiobjects.leasestart.selector);
        this.leasestartdate = Selector(leaseObject.data.data.pages.login.uiobjects.leasestartdate.selector);
        this.leaseend = Selector(leaseObject.data.data.pages.login.uiobjects.leaseend.selector);
        this.leaseenddate = Selector(leaseObject.data.data.pages.login.uiobjects.leaseenddate.selector);

        this.calculation = Selector(leaseObject.data.data.pages.login.uiobjects.calculation.selector);
        this.firstpayment = Selector(leaseObject.data.data.pages.login.uiobjects.firstpayment.selector);
        this.firstpaymentdate = Selector(leaseObject.data.data.pages.login.uiobjects.firstpaymentdate.selector);
        this.bondreference = Selector(leaseObject.data.data.pages.login.uiobjects.bondreference.selector);
        this.savebutton = Selector(leaseObject.data.data.pages.login.uiobjects.savebutton.selector);

        this.property = Selector(leaseObject.data.data.pages.login.uiobjects.property.selector);
        this.edit = Selector(leaseObject.data.data.pages.login.uiobjects.edit.selector);
        this.managementstartdate = Selector(leaseObject.data.data.pages.login.uiobjects.managementstartdate.selector);
        this.save = Selector(leaseObject.data.data.pages.login.uiobjects.save.selector);
        this.execute = this.execute.bind(this);

    }

    async execute(data) {

        //const frequency = Selector('#differentApp > div > div.content-dock > div > div.col.dashboard-content-area > div > div.leases-section > div > div:nth-child(3) > div:nth-child(2) > select');
        //const frequencyoption = frequency.find('Option');test

        await t

            .click(this.search)
            .typeText(this.search, data.propertyname)
            .click(this.propertyresults)
            .click(this.paymenttab)
            .click(this.addlease)

        await t
            .click(this.rentamount)
            .typeText(this.rentamount, data.rentamount)
            .wait(2000)

            .click(this.leasestart)
            .click(this.leasestartdate)
            .typeText(this.leasestartdate, data.leasestartdate)
            //     .wait(1000)
            //     .click(this.calculation)

            // if (getValue(t.fixtureCtx.data.addLease[i].leasetype) == "Fixed") {
            //     await t

            //         .click(this.leaseend)
            //         .wait(2000)
            //         .click(this.leaseenddate).pressKey('ctrl+a delete')
            //         .typeText(this.leaseenddate, getValue(t.fixtureCtx.data.addLease[i].leaseenddate))
            //         .click(this.calculation)
            //         .wait(2000)
            // }
            // await t

            //     .click(this.firstpayment)
            //     .click(this.firstpaymentdate)
            //     .typeText(this.firstpaymentdate, getValue(t.fixtureCtx.data.addLease[i].firstpaydate))

            //     .click(this.calculation)

            .click(this.bondreference)
            .typeText(this.bondreference, data.bondreferenceno)

            .click(this.savebutton)
            .wait(2000)

        // .click(this.property)
        // .click(this.edit)
        // .click(this.managementstartdate)
        // .typeText(this.managementstartdate, getValue(t.fixtureCtx.data.addLease[i].leasestartdate))
        // .click(this.save);


    }

}

//test@different.com.au 
//nW#&G0Z&!Xc:5

module.exports = addLeaseComponent;