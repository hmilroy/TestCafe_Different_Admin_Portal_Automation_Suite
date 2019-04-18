/**
 * @file keys Component.
 * @author Milroy Perera
 */
'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';
import BaseComponent from './BaseComponent';
import config from '../libs/helpers/configHelper';

class keysComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let keysObject = this.UIObjects.keysObject;
        let inspectionObject = this.UIObjects.inspectionObject;

        // UI objects with initialization
        this.search = Selector(keysObject.data.data.pages.login.uiobjects.search.selector);
        this.searchresults = Selector(keysObject.data.data.pages.login.uiobjects.searchresults.selector);
        this.correctuser = Selector(inspectionObject.data.data.pages.login.uiobjects.correctuser.selector);
        this.propertyresults = Selector(inspectionObject.data.data.pages.login.uiobjects.propertyresults.selector);
        this.propertynameindashboard = Selector(inspectionObject.data.data.pages.login.uiobjects.propertynameindashboard.selector);
        this.keystab = Selector(keysObject.data.data.pages.login.uiobjects.keystab.selector);
        this.editbutton = Selector(keysObject.data.data.pages.login.uiobjects.editbutton.selector);
        this.leasingcheckbox = Selector(keysObject.data.data.pages.login.uiobjects.leasingcheckbox.selector);
        this.managementcheckbox = Selector(keysObject.data.data.pages.login.uiobjects.managementcheckbox.selector);
        this.tenantcheckbox = Selector(keysObject.data.data.pages.login.uiobjects.tenantcheckbox.selector);
        this.accessNotes = Selector(keysObject.data.data.pages.login.uiobjects.accessNotes.selector);
        this.savebutton = Selector(keysObject.data.data.pages.login.uiobjects.savebutton.selector);

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
            //.click(this.managementcheckbox)
            .click(this.tenantcheckbox)
            .wait(2000)
            .typeText(this.accessNotes, data.notes)
            .click(this.savebutton)

    }

}
module.exports = keysComponent;