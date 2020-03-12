"use strict";

import { Selector, t } from "testcafe";
import BaseComponent from "./BaseComponent";

class propertyTabComponent extends BaseComponent {
  constructor() {
    // noinspection JSAnnotator
    super();

    let propertyTabObject = this.UIObjects.propertyTabObject;
    let loginObject = this.UIObjects.loginObject;

    // UI objects with initialization
    for (let [key, value] of Object.entries(
      loginObject.data.data.pages.login.uiobjects
    )) {
      this[key] = Selector(value.selector);
    }
    for (let [key, value] of Object.entries(
      propertyTabObject.data.data.pages.login.uiobjects
    )) {
      this[key] = Selector(value.selector);
    }
    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    const typeSelect = Selector(
      "#differentApp > div > div.content-dock > div > div.col.dashboard-content-area > div > div > div > div.view-property-form-container > form > div > div:nth-child(5) > select"
    );
    const typeOption = typeSelect.find("option");

    await t
      .click(this.search)
      .typeText(this.search, data.propertyname)
      .wait(3000)
      .click(this.propertyresults)
      .wait(1000)
      .click(this.propertyTab)
      .wait(2000)
      .click(this.editbutton)
      .typeText(this.saleprice, data.saleprice)
      .typeText(this.bedroom, data.bedroom)
      .typeText(this.bathroom, data.bathroom)
      .typeText(this.parking, data.parking);

    await t.click(typeSelect).click(typeOption.withExactText(data.type));

    if (data.swimmingpool == "Yes") {
      await t.click(this.SwimmingPoolYes);
    } else {
      await t.click(this.SwimmingPoolNo);
    }

    if (data.stratamanaged == "Yes") {
      await t.click(this.StrataManagedYes);
    } else {
      await t.click(this.StrataManagedNo);
    }

    if (data.previouspropertymanager == "Yes") {
      await t.click(this.PreviousPropertyManagerYes);
    } else {
      await t.click(this.PreviousPropertyManagerNo);
    }

    if (data.waterefficiencydevicesinstalled == "Yes") {
      await t.click(this.WaterEfficiencyDevicesYes);
    } else {
      await t.click(this.WaterEfficiencyDevicesNo);
    }

    if (data.waterseparatelymetered == "Yes") {
      await t.click(this.WaterSeparatelyMeteredYes);
    } else {
      await t.click(this.WaterSeparatelyMeteredNo);
    }

    if (data.builtbefore1980 == "Yes") {
      await t.click(this.BuiltBefore1980);
    } else {
      await t.click(this.BuiltBefore1980No);
    }

    if (data.hastenantatmanagementstart == "Yes") {
      await t.click(this.HasTenantAtManagementStart);
    } else {
      await t.click(this.NoTenantAtManagementStart);
    }

    //await t.click(this.ManagementStartDate);
    //await t.wait(2000)
   // await t.click(this.Date);
  // .setNativeDialogHandler(() => true)
   //.click(this.Date);

    // switch (data.swimmingpool) {
    //   case "Yes":
    //     await t.click(this.SwimmingPoolYes);
    //     break;
    //   case "No":
    //     await t.click(this.SwimmingPoolNo);
    //     break;
    //   default:
    //     break;
    // }
    await t.wait(25000);

    // .typeText(this.salePrice, data.salePrice)
    //  .click(this.savebutton)
  }
}
module.exports = propertyTabComponent;
