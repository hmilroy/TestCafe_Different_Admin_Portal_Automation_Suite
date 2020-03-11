/**
 * @file Login Component.
 * @author Milroy Perera
 */
"use strict";

import { Selector, t } from "testcafe";
import BaseComponent from "./BaseComponent";

class addLeaseComponent extends BaseComponent {
  constructor() {
    // noinspection JSAnnotator
    super();

    let leaseObject = this.UIObjects.leaseObject;
    let loginObject = this.UIObjects.loginObject;

    // UI objects with initialization

    for (let [key, value] of Object.entries(loginObject.data.data.pages.login.uiobjects)) {
      this[key] = Selector(value.selector);
    }
    for (let [key, value] of Object.entries(leaseObject.data.data.pages.login.uiobjects)) {
      this[key] = Selector(value.selector);
    }

    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    const frequencySelector = Selector("div.content-dock div.row.dashboard div.col.dashboard-content-area:nth-child(2) div.admin-padding-adjustment.add-person-form.people-tab div.leases-section:nth-child(3) div:nth-child(2) div.lease-row.row:nth-child(3) div.col-md-3:nth-child(2) > select:nth-child(1)");
    const frequencyOptions = frequencySelector.find("option");

    const FixedSecondCalender = Selector(() => {
      return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[2];
    });

    const PeriodicSecondCalender = Selector(() => {
      return document.querySelectorAll("input[class='ant-calendar-picker-input ant-input']")[1];
    });

    await t
      .click(this.search)
      .typeText(this.search, data.propertyname)
      .click(this.propertyresults)
      .click(this.paymenttab)
      .wait(2000)
      .click(this.addlease)
      .wait(2000);

    //=============Rent amount============================================================================
    await t.click(this.rentamount).typeText(this.rentamount, data.rentamount);

    //=============Rent Payment Frequency ================================================================
    await t
      .click(frequencySelector)
      .click(frequencyOptions.withText(data.rentfrequency));

    //==============fixed or periodic lease radio button & Auto converted to periodic tick=================
    // await t

    if (data.leasetype == "Fixed") {
      await t.click(this.fixedlease);

      if (data.autoconvert == "No") {
        await t.click(this.autoConvertPeriodic);
      }
   //=============Date picker for fixed lease ======================================================
      await t
        .click(this.calenderpicker)
        .wait(1000)
        .click(this.year.withText(data.leasestartyear))
        .click(this.month.withText(data.leasestartmonth))
        .click(this.day.withText(data.leasestartday))

        .click(FixedSecondCalender)
        .wait(1000)
        .click(this.year.withText(data.leasestartyear))
        .click(this.month.withText(data.leasestartmonth))
        .click(this.day.withText(data.leasestartday));
    } 
    
    else {
      await t
        .click(this.periodiclease)
  //=============Date picker for periodic lease =============================================
        .click(this.calenderpicker)
        .wait(1000)
        .click(this.year.withText(data.leasestartyear))
        .click(this.month.withText(data.leasestartmonth))
        .click(this.day.withText(data.leasestartday))

        .click(PeriodicSecondCalender)
        .wait(1000)
        .click(this.year.withText(data.leaseendyear))
        .click(this.month.withText(data.leaseendmonth))
        .click(this.day.withText(data.leasestartday));
    }
    await t
      .click(this.bondreference)
      .typeText(this.bondreference, data.bondreferenceno)
      .click(this.savebutton)
      .wait(3000)
      .click(this.searchClose);
  }
}
module.exports = addLeaseComponent;
