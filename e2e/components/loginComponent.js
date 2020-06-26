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

        for (let [key, value] of Object.entries(loginObject.data.data.pages.login.uiobjects)) {
            this[key] = Selector(value.selector);
          }

          this.execute = this.execute.bind(this);
    }

    async execute(data) {

        await t

            .maximizeWindow()
            .wait(2000)
            .click(this.buttonSignInWithGoogle)
            .typeText(this.inputEmail, data.email)
            .wait(2000)
            .pressKey('enter')
            .typeText(this.inputPassword, data.password)
            .wait(2000)
            .pressKey('enter')
            .wait(6000)
            .navigateTo(config.appdata.baseUrl)
            .expect(this.spanNameHolder.textContent).eql(t.fixtureCtx.data.userLogin[0].displayname)
            .wait(2000)
    }
}
module.exports = LoginComponent;
//test@different.com.au
//  Diff:#&G0Z&!X@