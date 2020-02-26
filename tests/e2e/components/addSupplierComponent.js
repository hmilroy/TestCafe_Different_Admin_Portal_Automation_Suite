'use strict';

import { Selector, t } from 'testcafe';
import BaseComponent from './BaseComponent';

class addSupplierComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator tt
        super();

        let loginObject = this.UIObjects.loginObject;
        let addsupplierObject = this.UIObjects.addsupplierObject;

        // UI objects with initialization
        this.buttonSignInWithGoogle = Selector(loginObject.get('data.pages.login.uiobjects.buttonSignInWithGoogle.selector'));
        this.inputEmail = Selector(loginObject.data.data.pages.login.uiobjects.inputEmail.selector);
        this.inputPassword = Selector(loginObject.data.data.pages.login.uiobjects.inputPassword.selector);
        this.spanNameHolder = Selector(loginObject.data.data.pages.login.uiobjects.spanNameHolder.selector);      
        this.addpersonbutton = Selector(addsupplierObject.data.data.pages.login.uiobjects.addpersonbutton.selector);

        this.abn = Selector(addsupplierObject.data.data.pages.login.uiobjects.abn.selector);
        this.suppliername = Selector(addsupplierObject.data.data.pages.login.uiobjects.suppliername.selector);
        this.name = Selector(addsupplierObject.data.data.pages.login.uiobjects.name.selector);
        this.name2 = Selector(addsupplierObject.data.data.pages.login.uiobjects.name2.selector);
        this.email = Selector(addsupplierObject.data.data.pages.login.uiobjects.email.selector);
        this.email2 = Selector(addsupplierObject.data.data.pages.login.uiobjects.email2.selector);
        this.address = Selector(addsupplierObject.data.data.pages.login.uiobjects.address.selector);
        this.address2 = Selector(addsupplierObject.data.data.pages.login.uiobjects.address2.selector);
        this.phone = Selector(addsupplierObject.data.data.pages.login.uiobjects.phone.selector);
        this.phone2 = Selector(addsupplierObject.data.data.pages.login.uiobjects.phone2.selector);
        this.website = Selector(addsupplierObject.data.data.pages.login.uiobjects.website.selector);
        this.category = Selector(addsupplierObject.data.data.pages.login.uiobjects.category.selector);
        this.calloutfee = Selector(addsupplierObject.data.data.pages.login.uiobjects.calloutfee.selector);
        this.emergehcycallfee = Selector(addsupplierObject.data.data.pages.login.uiobjects.emergehcycallfee.selector);
        this.notes = Selector(addsupplierObject.data.data.pages.login.uiobjects.notes.selector);
        this.savebutton = Selector(addsupplierObject.data.data.pages.login.uiobjects.savebutton.selector);   

        this.execute = this.execute.bind(this);

    }
    //Test
    async execute(data) {
        // const roleselect = Selector('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div.form-group.row.element.main-selection > select');
        // const roleoption = roleselect.find('option');

        // const catagoryselect = Selector('#differentApp > div > div.content-dock > div > div > form > div.inner-form > div.person-role-form > div:nth-child(1) > div.form-group.row.element.main-selection.category > div > div > select');
        // const catagoryoption = catagoryselect.find('option');


        await t

            .click(this.addpersonbutton)
            .wait(4000)


            .typeText(this.suppliername, data.suppliername)

            .typeText(this.name, data.name)
            .typeText(this.name2, data.name2)
            .typeText(this.email, data.email)
            .wait(2000)
            .typeText(this.email2, data.email2)

            .typeText(this.address, data.address)
            .typeText(this.address2, data.address2)

            .typeText(this.phone, data.phone)
            .typeText(this.phone2, data.phone2)

            .typeText(this.website, data.website)
            .typeText(this.calloutfee, data.calloutfee)

            .typeText(this.emergehcycallfee, data.emergehcycallfee)
            .typeText(this.notes, data.notes)
           
            .typeText(this.abn, data.abn)
            .wait(5000)
            .click(this.savebutton)
            .wait(18000);
          
    
   }
}

module.exports = addSupplierComponent;