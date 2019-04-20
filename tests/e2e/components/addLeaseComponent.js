/**
 * @file Login Component.
 * @author Milroy Perera
 */
'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';
import BaseComponent from './BaseComponent';
import config from '../libs/helpers/configHelper';

class addLeaseComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let leaseObject = this.UIObjects.leaseObject;
        let loginObject = this.UIObjects.loginObject;
        
        // UI objects with initialization
        this.spanNameHolder = Selector(loginObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.search = Selector(loginObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(loginObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(loginObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(loginObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(loginObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        
        this.paymenttab = Selector(leaseObject.data.data.pages.login.uiobjects.paymenttab.selector);
        this.addlease = Selector(leaseObject.data.data.pages.login.uiobjects.addlease.selector);
        this.fixedlease = Selector(leaseObject.data.data.pages.login.uiobjects.fixedlease.selector);
        this.periodiclease = Selector(leaseObject.data.data.pages.login.uiobjects.periodiclease.selector);
        this.rentamount = Selector(leaseObject.data.data.pages.login.uiobjects.rentamount.selector);
        this.leaseend = Selector(leaseObject.data.data.pages.login.uiobjects.leaseend.selector);
        this.leaseenddate = Selector(leaseObject.data.data.pages.login.uiobjects.leaseenddate.selector);
        this.autoConvertPeriodic = Selector(leaseObject.data.data.pages.login.uiobjects.autoConvertPeriodic.selector);
        this.calenderpicker = Selector(leaseObject.data.data.pages.login.uiobjects.calenderpicker.selector);
        this.year = Selector(leaseObject.data.data.pages.login.uiobjects.year.selector);
        this.month = Selector(leaseObject.data.data.pages.login.uiobjects.month.selector);
        this.day = Selector(leaseObject.data.data.pages.login.uiobjects.day.selector);
        this.calculation = Selector(leaseObject.data.data.pages.login.uiobjects.calculation.selector);
        this.bondreference = Selector(leaseObject.data.data.pages.login.uiobjects.bondreference.selector);
        this.savebutton = Selector(leaseObject.data.data.pages.login.uiobjects.savebutton.selector);
        this.searchClose = Selector(leaseObject.data.data.pages.login.uiobjects.searchClose.selector);
//reree
        this.execute = this.execute.bind(this);

    }
    async execute(data) {

        const frequencySelector = Selector('div.content-dock div.row.dashboard div.col.dashboard-content-area:nth-child(2) div.admin-padding-adjustment.add-person-form.people-tab div.leases-section:nth-child(3) div:nth-child(2) div.lease-row.row:nth-child(3) div.col-md-3:nth-child(2) > select:nth-child(1)');
        const frequencyOptions = frequencySelector.find('option');

        const secondCalender = Selector(() => {
            return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[2];
        })

        const secondCalenderperiodic = Selector(() => {
            return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[1];
        })

        await t
            
            .click(this.search)
            .typeText(this.search, data.propertyname)
            .click(this.propertyresults)
            .wait(2000)
            .click(this.paymenttab)
            .click(this.addlease)

        //==============fixed or periodic lease radio button & Auto converted to periodic tick=================
        await t

        if (data.leasetype == "Fixed") {
            await t
                .click(this.fixedlease)

            if (data.autoconvert == "No") {
                await t
                    .click(this.autoConvertPeriodic)
            }
            //=============Date picker for fixed lease ========================================================
            await t
                .click(this.calenderpicker)
                .wait(1000)
                .click(this.year.withText(data.leasestartyear))
                .click(this.month.withText(data.leasestartmonth))
                .click(this.day.withText(data.leasestartday))

                .click(secondCalender)
                .wait(1000)
                .click(this.year.withText(data.leasestartyear))
                .click(this.month.withText(data.leasestartmonth))
                .click(this.day.withText(data.leasestartday))
        }
        else {
            await t
                .click(this.periodiclease)

                //=============Date picker for periodic lease =================================================
                .click(this.calenderpicker)
                .wait(1000)
                .click(this.year.withText(data.leasestartyear))
                .click(this.month.withText(data.leasestartmonth))
                .click(this.day.withText(data.leasestartday))

                .click(secondCalenderperiodic)
                .wait(1000)
                .click(this.year.withText(data.leaseendyear))
                .click(this.month.withText(data.leaseendmonth))
                .click(this.day.withText(data.leasestartday))
        }
        //=============Rent amount============================================================================
        await t
            .click(this.rentamount)
            .typeText(this.rentamount, data.rentamount)

        //=============Rent Payment Frequency ================================================================

        await t
            .click(frequencySelector)
            .click(frequencyOptions.withText(data.rentfrequency))
            .click(this.bondreference)
            .typeText(this.bondreference, data.bondreferenceno)
            .click(this.savebutton)
            .wait(3000)
            .click(this.searchClose)
    }

}
module.exports = addLeaseComponent;