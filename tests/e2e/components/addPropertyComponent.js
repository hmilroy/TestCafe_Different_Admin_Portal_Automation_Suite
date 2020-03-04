'use strict';

import { Selector, t, ClientFunction } from 'testcafe';
import BaseComponent from './BaseComponent';

class addPropertyComponent extends BaseComponent {
    constructor() {
        // noinspection JSAnnotator
        super();

        let addpropertyObject = this.UIObjects.addpropertyObject;

        // UI objects with initialization
        for (let [key, value] of Object.entries(addpropertyObject.data.data.pages.login.uiobjects)) {
            this[key] = Selector(value.selector);
          }
        this.execute = this.execute.bind(this);
    }

    async execute(data) {
     
        const addressType = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(1) > div > div > select');
        const addressOption = addressType.find('option');

        const streettype = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(3) > div > div > select');
        const streetoption = streettype.find('Option');

        const regionselector = Selector('#differentApp > div > div.content-dock > div > form > div.inner-form.add-property-form > div.custom-address-comp > div:nth-child(6) > div > div > div.col-xs-6.countrySelect__wrapper > select');
        const regionoption = regionselector.find('Option');

       
        await t
       // .navigateTo(config.appdata.baseUrl)
       //.expect(this.spanNameHolder.textContent).eql(t.fixtureCtx.data.userLogin[0].displayname)

            .click(this.createproperty)
            .wait(2000)
            .click(this.cantfind)

            .click(addressType)
            .click(addressOption.withExactText(data.unit))

            .typeText(this.unitnumber, data.unitnumber)
            .typeText(this.number, data.number)
            .typeText(this.street, data.street)

            .click(streettype)
            .click(streetoption.withExactText(data.streettype))

            .typeText(this.suburb, data.suburb)
            .typeText(this.postcode, data.postcode)

            .click(regionselector)
            .click(regionoption.withExactText(data.region))

            .click(this.email)
            .typeText(this.email, data.email)
            .click(this.addnewemail)
            .typeText(this.ownername, data.ownername)
            .wait(2000)
            .click(this.savebutton)
            .wait(5000);
    }
}
//test@different.com.au 
//nW#&G0Z&!Xc:5
module.exports = addPropertyComponent;