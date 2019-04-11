/**
 * @file Login Component.
 */
'use strict';

import { Selector, t } from 'testcafe';
import getValue from 'get-value';

import BaseComponent from './BaseComponent';
import config from '../helpers/configHelper';
import { Input } from 'antd';
import { Divider } from 'material-ui';

class addPersonComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let addpersonObject = this.UIObjects.addpersonObject;

        // UI objects with initialization
        this.buttonSignInWithGoogle = Selector(addpersonObject.get('data.pages.login.uiobjects.buttonSignInWithGoogle.selector'));
        this.inputEmail = Selector(addpersonObject.data.data.pages.login.uiobjects.inputEmail.selector);
        this.inputPassword = Selector(addpersonObject.data.data.pages.login.uiobjects.inputPassword.selector);
        this.spanNameHolder = Selector(addpersonObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.addpersonbutton = Selector(addpersonObject.data.data.pages.login.uiobjects.addpersonbutton.selector);
        this.roleemail = Selector(addpersonObject.data.data.pages.login.uiobjects.roleemail.selector);

        this.addnewpersonemail = Selector(addpersonObject.data.data.pages.login.uiobjects.addnewpersonemail.selector);
        this.newpereonname = Selector(addpersonObject.data.data.pages.login.uiobjects.newpereonname.selector);
        this.mobileno = Selector(addpersonObject.data.data.pages.login.uiobjects.mobileno.selector);
        this.newcompany = Selector(addpersonObject.data.data.pages.login.uiobjects.newcompany.selector);
        this.website = Selector(addpersonObject.data.data.pages.login.uiobjects.website.selector);
        this.newcatagory = Selector(addpersonObject.data.data.pages.login.uiobjects.newcatagory.selector);
        this.savebutton = Selector(addpersonObject.data.data.pages.login.uiobjects.savebutton.selector);

        this.execute = this.execute.bind(this);

    }

    async execute() {
        const roleselect = Selector('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div.form-group.row.element.main-selection > select');
        const roleoption = roleselect.find('option');


        await t

            // .maximizeWindow()
            // .click(this.buttonSignInWithGoogle)
            // .typeText(this.inputEmail, getValue(t.fixtureCtx.data, 'userLogin.0.email'))
            // .pressKey('enter')
            // .typeText(this.inputPassword, t.fixtureCtx.data.userLogin[0].password)
            // .pressKey('enter')
            // .navigateTo(config.appdata.baseUrl)
            // .expect(this.spanNameHolder.textContent).eql(t.fixtureCtx.data.userLogin[0].displayname)

            .click(this.addpersonbutton)

            .click(roleselect)
            .click(roleoption.withText('Tradie'))

            .click(this.roleemail)
            .typeText(this.roleemail, t.fixtureCtx.data.addPerson[0].newroleemail)
            .click(this.addnewpersonemail)

            .typeText(this.newpereonname, t.fixtureCtx.data.addPerson[0].newname)

            .typeText(this.mobileno, t.fixtureCtx.data.addPerson[0].mobileno)

            .typeText(this.newcompany, t.fixtureCtx.data.addPerson[0].company)

            .typeText(this.website, t.fixtureCtx.data.addPerson[0].website)

            .typeText(this.newcatagory, t.fixtureCtx.data.addPerson[0].category)
            .wait(2000)
            .click(this.savebutton);

    }
}

module.exports = addPersonComponent;