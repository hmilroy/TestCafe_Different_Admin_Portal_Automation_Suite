'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';
import BaseComponent from './BaseComponent';
import config from '../libs/helpers/configHelper';
// import { Input } from 'antd';
//  import { Divider } from 'material-ui';

class addInspectionsComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let inspectionObject = this.UIObjects.inspectionObject;

        // UI objects with initialization
        //  this.spanNameHolder = Selector(inspectionObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.search = Selector(inspectionObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(inspectionObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(inspectionObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(inspectionObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(inspectionObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        this.inspectiontab = Selector(inspectionObject.data.data.pages.login.uiobjects.inspectiontab.selector);
        this.addinspectionbutton = Selector(inspectionObject.data.data.pages.login.uiobjects.addinspectionbutton.selector);
        this.inspectiondialogbox = Selector(inspectionObject.data.data.pages.login.uiobjects.inspectiondialogbox.selector);
        this.supplierResults = Selector(inspectionObject.data.data.pages.login.uiobjects.supplierResults.selector);
        this.typeSelectors = Selector(inspectionObject.data.data.pages.login.uiobjects.typeSelectors.selector);
        this.dragfile = Selector(inspectionObject.data.data.pages.login.uiobjects.dragfile.selector);


        this.calenderpicker = Selector(inspectionObject.data.data.pages.login.uiobjects.calenderpicker.selector);
        this.year = Selector(inspectionObject.data.data.pages.login.uiobjects.year.selector);
        this.month = Selector(inspectionObject.data.data.pages.login.uiobjects.month.selector);
        this.day = Selector(inspectionObject.data.data.pages.login.uiobjects.day.selector);

        this.searchClose = Selector(inspectionObject.data.data.pages.login.uiobjects.searchClose.selector);
        //reree
        this.execute = this.execute.bind(this);

    }
    async execute(data) {

        const typeSelector = this.typeSelectors;
        const typeOptions = typeSelector.find('option');

        // const secondCalender = Selector(() => {
        //     return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[2];
        // })

        // const secondCalenderperiodic = Selector(() => {
        //     return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[1];
        // })

        await t

            .click(this.search)
            .typeText(this.search, data.propertyname)
            .click(this.propertyresults)
            //.wait(2000)
            .click(this.inspectiontab)
            .click(this.addinspectionbutton)
            .wait(2000)
            .click(this.inspectiondialogbox)
            .wait(2000)
            // .typeText(this.inspectiondialogbox,data.suppliername)
            // .wait(5000)
            // .click(this.supplierResults)


            .click(this.dragfile)

        await t
            .click(this.calenderpicker)
            .wait(1000)
            .click(this.year.withText(data.leasestartyear))
            .click(this.month.withText(data.leasestartmonth))
            .click(this.day.withText(data.leasestartday))


            .click(typeSelector)
            .click(typeOptions.withText(data.types))

        await t


            .click(this.searchClose);
    }

}
module.exports = addInspectionsComponent;