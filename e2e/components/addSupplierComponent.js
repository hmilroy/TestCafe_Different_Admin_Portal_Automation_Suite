"use strict";

import { Selector, t } from "testcafe";
import BaseComponent from "./BaseComponent";

class addSupplierComponent extends BaseComponent {
  constructor() {
    // noinspection JSAnnotator tt
    super();

    let addsupplierObject = this.UIObjects.addsupplierObject;

    // shorter code for UI objects with initialization (by Sanath)
    for (let [key, value] of Object.entries(addsupplierObject.data.data.pages.login.uiobjects)) {
      this[key] = Selector(value.selector);
    }
    this.execute = this.execute.bind(this);
  }
  //Test
  async execute(data) {
    await t

      .click(this.addpersonbutton)
      .wait(4000)
      .typeText(this.suppliername, data.suppliername)
      .typeText(this.name, data.name)
      .typeText(this.email, data.email)
      .typeText(this.address, data.address)
      .typeText(this.phone, data.phone);

    if (data.sameasbillingcontact == "Yes") {
      await t.click(this.sameasbillingcontactracticbox);
    } else {
      await t
        .typeText(this.name2, data.name2)
        .typeText(this.email2, data.email2)
        .typeText(this.address2, data.address2)
        .typeText(this.phone2, data.phone2);
    }
    await t
      .typeText(this.website, data.website)
      .typeText(this.calloutfee, data.calloutfee)
      .typeText(this.emergehcycallfee, data.emergehcycallfee)
      .typeText(this.notes, data.notes);

    const category = data.category.toLowerCase();
    await t
    .click(this[category]);

    const servicearea = data.servicearea.toLowerCase();
    await t
    .click(this[servicearea]);

    await t
      .click(this.isgoodforurgentrequests)
      .click(this.isavailableonweekends)
      .click(this.isavailableoutsidenormalhours);

     await t
      .typeText(this.abn, data.abn)
      .typeText(this.bsb, data.bsb)
      .typeText(this.accountno, data.accountno)
      .typeText(this.accountholder, data.accountholder)
     
     // .click(this.upload)
      .wait(2000)
     // .click(this.upload)
  //    await t.setFilesToUpload('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div:nth-child(1) > div:nth-child(22) > div > div > div > div', '/home/milroy/TestCafe_Different_Admin_Portal_Automation_Suite/tests/UploadFiles/GST.pdf')
                                                                                                                                                               
     // .wait(12000)

      .click(this.savebutton)
      .wait(12000);
  }
}

module.exports = addSupplierComponent;
