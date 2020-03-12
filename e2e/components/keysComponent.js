/**
 * @file keys Component.
 * @author Milroy Perera
 */
'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class keysComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let loginObject = this.UIObjects.loginObject;
        let keysObject = this.UIObjects.keysObject;
      

        // UI objects with initialization
        for (let [key, value] of Object.entries(loginObject.data.data.pages.login.uiobjects)) {
            this[key] = Selector(value.selector);
          }

          for (let [key, value] of Object.entries(keysObject.data.data.uiobjects)) {
            this[key] = Selector(value.selector);
          }
        // this.search = Selector(loginObject.data.data.pages.login.uiobjects.search.selector);
        // this.searchresults = Selector(loginObject.data.data.pages.login.uiobjects.searchresults.selector);
      
        this.execute = this.execute.bind(this);

    }
    async execute(data) {

        await t
            .click(this.search)
            .typeText(this.search, data.propertyname)
            .click(this.propertyresults)
            .click(this.keystab)
            .click(this.editbutton)
            .click(this.leasingcheckbox)
            .click(this.tenantcheckbox)
            .wait(2000)
            .typeText(this.accessNotes, data.notes)
            .click(this.savebutton)

    }

}
module.exports = keysComponent;