"use strict";

import { Selector, t } from "testcafe";
import BaseComponent from "./BaseComponent";
import { ClientFunction } from 'testcafe';

class ownerMaaSignComponent extends BaseComponent {
  constructor() {
    // noinspection JSAnnotator tt
    super();

    let ownerPortalObject = this.UIObjects.ownerPortalObject;

    for (let [key, value] of Object.entries(
      ownerPortalObject.data.data.pages.login.uiobjects
    )) {
      this[key] = Selector(value.selector);
    }

    let loginObject = this.UIObjects.loginObject;
    for (let [key, value] of Object.entries(
      loginObject.data.data.pages.login.uiobjects
    )) {
      this[key] = Selector(value.selector);
    }

    this.execute = this.execute.bind(this);
  }
  //Test
  async execute(data) {
    await t

   
      // .click(this.search)
      // .typeText(this.search, data.searchitem)
      // .click(this.propertyresults)
      // .wait(3000)
      // .click(this.closeSerchButton)
      // .wait(2000)
      // .click(this.peoplesTab)
      // .wait(5000)
     //.click(this.resend)
     //.click(this.loginasowner)
      .wait(2000)
      .navigateTo('https://owner-qa.different.com.au/')
      .wait(2000)

      .typeText(this.ownerEmail, data.email)
            .pressKey('enter')
            //.wait(8000)
            .typeText(this.ownerPassword, data.password)
            .pressKey('enter')
           
           // .navigateTo(config.appdata.baseUrl)
           // .expect(this.propertyListBox.textContent).eql(t.fixtureCtx.data.ownerMaa.searchitem)
         
            .wait(5000)

            // .typeText(this.bsbno, data.bsb)
            // .typeText(this.accountno, data.account)
            //  .click(this.nextbutton1)
            //  .wait(2000)
            //  .click(this.registeredno)
            //  .click(this.secondoryownerno)
            //  .click(this.nextbutton2)
            //  .wait(2000)
            //  .click(this.furnishedno)
            //  .click(this.carspaceno)
            //  .click(this.tenantinno)
            //  .click(this.propertymanagerno)
            //  .click(this.Insuranceno)
            //  .click(this.nextbutton3)
            //  .wait(2000)
            //  .click(this.savesignbutton)
             .wait(21000)
             .click(this.okbutton)

             
             .wait(204400)
  }
}

module.exports = ownerMaaSignComponent;
