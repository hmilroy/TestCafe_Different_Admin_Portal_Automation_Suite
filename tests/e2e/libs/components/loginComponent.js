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

class LoginComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let loginObject = this.UIObjects.loginObject;
        let addpropertyObject = this.UIObjects.addpropertyObject;

        // UI objects with initialization
        this.buttonSignInWithGoogle = Selector(loginObject.get('data.pages.login.uiobjects.buttonSignInWithGoogle.selector'));
        this.inputEmail = Selector(loginObject.data.data.pages.login.uiobjects.inputEmail.selector);
        this.inputPassword = Selector(loginObject.data.data.pages.login.uiobjects.inputPassword.selector);
        this.spanNameHolder = Selector(loginObject.data.data.pages.login.uiobjects.spanNameHolder.selector);
        this.createproperty = Selector(addpropertyObject.data.data.pages.login.uiobjects.createproperty.selector);
        this.cantfind = Selector(addpropertyObject.data.data.pages.login.uiobjects.cantfind.selector);
        this.dropdown = Selector(addpropertyObject.data.data.pages.login.uiobjects.dropdown.selector);
        this.unitnumber = Selector(addpropertyObject.data.data.pages.login.uiobjects.unitnumber.selector);
        this.street = Selector(addpropertyObject.data.data.pages.login.uiobjects.street.selector);
        this.suburb = Selector(addpropertyObject.data.data.pages.login.uiobjects.suburb.selector);
        this.postcode = Selector(addpropertyObject.data.data.pages.login.uiobjects.postcode.selector);
        this.email = Selector(addpropertyObject.data.data.pages.login.uiobjects.email.selector);
        this.addnewemail = Selector(addpropertyObject.data.data.pages.login.uiobjects.addnewemail.selector);
        this.ownername = Selector(addpropertyObject.data.data.pages.login.uiobjects.ownername.selector);
        this.savebutton = Selector(addpropertyObject.data.data.pages.login.uiobjects.savebutton.selector);

        this.execute = this.execute.bind(this);
    }

    async execute() {
        const citySelect = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(1) > div > div > select');
        const cityOption = citySelect.find('option');
        const streettype = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(3) > div > div > select');
        const streetoption = streettype.find('Option');
        const regionselector = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(6) > div > div > div.col-xs-6.countrySelect__wrapper > select');
        const regionoption = regionselector.find('Option');

        await t
   
            .maximizeWindow()
            .click(this.buttonSignInWithGoogle)
            .typeText(this.inputEmail, getValue(t.fixtureCtx.data, 'userLogin.0.email'))
            .pressKey('enter')
            .typeText(this.inputPassword, t.fixtureCtx.data.userLogin[0].password)
            .pressKey('enter')
            .navigateTo(config.appdata.baseUrl)
            .expect(this.spanNameHolder.textContent).eql(t.fixtureCtx.data.userLogin[0].displayname)
            .wait(2000)

    }
}
//test@different.com.au
//nW#&G0Z&!Xc:5
//test
module.exports = LoginComponent;