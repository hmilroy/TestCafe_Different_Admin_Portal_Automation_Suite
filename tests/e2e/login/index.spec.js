/**
 * @file Test class for all login page related test cases.
 */
'use strict';

import Libs from '../libs';

const components = Libs.components;
const config = Libs.helpers.configHelper;
const dataHelper = new Libs.helpers.dataHelper();

fixture`:Different Admin Portal Test Suite`
    .page`${config.appdata.baseUrl}`
    .before(async ctx => {
        await dataHelper.data.then((data) => {
            ctx.data = data.data;
        });
    });

 


// const addPersonComponent  = new components.addPersonComponent();
// test('Add Person funtionality', addPersonComponent.execute);

// const addMultyPropertyComponent = new components.addMultyPropertyComponent();
// test('Add Multiple properties funtionality', addMultyPropertyComponent.execute);


//const addLeaseComponent = new components.addLeaseComponent();
//test('Add Leases funtionality', addLeaseComponent.execute);
//Test