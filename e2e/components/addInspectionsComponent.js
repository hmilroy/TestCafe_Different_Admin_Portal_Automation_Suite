'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class addInspectionsComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let inspectionObject = this.UIObjects.inspectionObject;
        // UI objects with initialization     

        for (let [key, value] of Object.entries(inspectionObject.data.data.pages.login.uiobjects)) {
            this[key] = Selector(value.selector);
          }

         this.execute = this.execute.bind(this);

    }
    async execute(data) {

        const typeSelector = this.typeSelectors;
        const typeOptions = typeSelector.find('option');

        const leaseSelector = this.leaseSelectors;
        const leaseOptions = leaseSelector.find('option');

        await t

            .click(this.search)
            .typeText(this.search, data.propertyname)
            .click(this.propertyresults)
            .click(this.inspectiontab)
            .click(this.addinspectionbutton)
            .wait(2000)
            .click(this.inspectiondialogbox)
            .wait(2000)

            .click(typeSelector)
            .click(typeOptions.withText(data.types))
            .click(this.inspectiondialogbox)

            .wait(2000)
            .click(leaseSelector)
           // .click(leaseOptions.withText(data.lease))
           .click(leaseOptions.withText(data.lease))
            //.click(this.dragfile)

        //await t
            .click(this.calenderpicker)
            .wait(1000)
            .click(this.year.withText(data.leasestartyear))
            .click(this.month.withText(data.leasestartmonth))
            .click(this.day.withText(data.leasestartday))

          //await 
           // t.setFilesToUpload( 'body > div:nth-child(5) > div > div:nth-child(1) > div > div > div:nth-child(1) > div.col-xs-12.drop-zone-content', '/home/milroy/TestCafe_Different_Admin_Portal_Automation_Suite/tests/UploadFiles/GST.pdf' )


            // .typeText(this.inspectiondialogbox,data.suppliername)
            // .wait(9000)
            // .click(this.supplierResults)

            
            .wait(2000)
            .click(this.save)


       // await t

            //.click(this.searchClose);
    }

}
module.exports = addInspectionsComponent;