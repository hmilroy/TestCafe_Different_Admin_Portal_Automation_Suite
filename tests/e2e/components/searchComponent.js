
/**
 * @file Login Component.
 * @author Hasitha Gamage
 */
'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class searchComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let loginObject = this.UIObjects.loginObject;
     
        // UI objects with initialization
        this.search = Selector(loginObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(loginObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(loginObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(loginObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(loginObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        this.closeSerchButton = Selector(loginObject.data.data.pages.login.uiobjects.closeSerchButton.selector);
        this.execute = this.execute.bind(this);

    }

    async execute(data) {

        await t

            .click(this.search)
            .typeText(this.search, data.searchitem)
            .click(this.propertyresults)
            .wait(3000)
            .click(this.closeSerchButton)

    }
}
module.exports = searchComponent;
