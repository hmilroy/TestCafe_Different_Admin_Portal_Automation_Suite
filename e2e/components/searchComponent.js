"use strict";

import { Selector, t } from "testcafe";
import BaseComponent from "./BaseComponent";

class searchComponent extends BaseComponent {
  constructor() {
    // noinspection JSAnnotator
    super();

    let loginObject = this.UIObjects.loginObject;
    for (let [key, value] of Object.entries(loginObject.data.data.pages.login.uiobjects)) {
      this[key] = Selector(value.selector);
    }

    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    await t

      .click(this.search)
      .typeText(this.search, data.searchitem)
      .click(this.propertyresults)
      .wait(3000)
      .click(this.closeSerchButton)
      .wait(3000)
      .expect(this.propertynameholder.textContent)
      .contains(t.fixtureCtx.data.search[0].searchitem);
  }
}
module.exports = searchComponent;
