/**
 * @file Login Component
 * @author Hasitha Gamage
 */
'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';
import config from '../libs/helpers/configHelper';

class LoginComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let loginObject = this.UIObjects.loginObject;

        // UI objects with initialization
        this.buttonSignInWithGoogle = Selector(loginObject.get('data.pages.login.uiobjects.buttonSignInWithGoogle.selector'));
        this.inputEmail = Selector(loginObject.data.data.pages.login.uiobjects.inputEmail.selector);
        this.inputPassword = Selector(loginObject.data.data.pages.login.uiobjects.inputPassword.selector);
        this.spanNameHolder = Selector(loginObject.data.data.pages.login.uiobjects.spanNameHolder.selector);

        this.execute = this.execute.bind(this);
    }

    async execute(data) {

        await t
        
            .maximizeWindow()
            .click(this.buttonSignInWithGoogle)
            .typeText(this.inputEmail, data.email)
            .pressKey('enter')
            .wait(2000)
            .typeText(this.inputPassword, data.password)
            .pressKey('enter')
            .navigateTo(config.appdata.baseUrl)
            .expect(this.spanNameHolder.textContent).eql(t.fixtureCtx.data.userLogin[0].displayname)
            .wait(2000)
    }
}
//test@different.com.au
//nW#&G0Z&!Xc:5
//.typeText(this.inputEmail, getValue(t.fixtureCtx.data, 'userLogin.0.email'))
module.exports = LoginComponent;