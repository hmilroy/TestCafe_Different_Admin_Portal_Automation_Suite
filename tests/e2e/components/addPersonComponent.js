/**
 * @file Login Component.
 * @author Hasitha Gamage
 */
'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class addPersonComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator tt
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
        this.mailingAddress = Selector(addpersonObject.data.data.pages.login.uiobjects.mailingAddress.selector);
        this.addressoption = Selector(addpersonObject.data.data.pages.login.uiobjects.addressoption.selector);
        this.newcompany = Selector(addpersonObject.data.data.pages.login.uiobjects.newcompany.selector);
        this.website = Selector(addpersonObject.data.data.pages.login.uiobjects.website.selector);
        this.newcatagory = Selector(addpersonObject.data.data.pages.login.uiobjects.newcatagory.selector);
        this.catagoryoption = Selector(addpersonObject.data.data.pages.login.uiobjects.catagoryoption.selector);
        this.savebutton = Selector(addpersonObject.data.data.pages.login.uiobjects.savebutton.selector);
        this.mainlogo = Selector(addpersonObject.data.data.pages.login.uiobjects.mainlogo.selector);
        

        this.execute = this.execute.bind(this);

    }

    async execute(data) {
        const roleselect = Selector('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div.form-group.row.element.main-selection > select');
        const roleoption = roleselect.find('option');

        const catagoryselect = Selector('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div.person-role-form > div:nth-child(1) > div.form-group.row.element.main-selection.category > div > div > select');
        const catagoryoption = catagoryselect.find('option');


        await t

            .click(this.addpersonbutton)
            .wait(4000)


        if (data.role == "Tradie") {
            await t
                .click(roleselect)
                .click(roleoption.withText(data.role))
                .click(this.roleemail)
                .typeText(this.roleemail, data.newroleemail)
                .click(this.addnewpersonemail)
                .typeText(this.newpereonname, data.newname)
                .typeText(this.mobileno, data.mobileno)
                .typeText(this.mailingAddress, data.mailingadd)
                .click(this.addressoption)
                .typeText(this.newcompany, data.company)
                .typeText(this.website, data.website)
                .click(catagoryselect)
                .click(catagoryoption.withText(data.catagoryoptiondrop))
                //.typeText(this.newcatagory, data.category)
                .wait(2000)
                .click(this.savebutton);
        }
        else {
            await t
                .click(roleselect)
                .click(roleoption.withText(data.role))
                .click(this.roleemail)
                .typeText(this.roleemail, data.newroleemail)
                .click(this.addnewpersonemail)
                .typeText(this.newpereonname, data.newname)
                .typeText(this.mobileno, data.mobileno)
                .typeText(this.mailingAddress, data.mailingadd)
                .click(this.addressoption)
                .wait(2000)
                .click(this.savebutton)

                .click(this.mainlogo)
                .wait(2000);

        }
        await t




    }
}

module.exports = addPersonComponent;