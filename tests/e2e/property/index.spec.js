
'use strict';

import Libs from '../libs';
import { Selector, t } from 'testcafe';

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

 const loginComponent  = new components.loginComponent();
 const addPropertyComponent  = new components.addPropertyComponent();
 const searchComponent  = new components.searchComponent();
 const addLeaseComponent = new components.addLeaseComponent();
 

//  test('Add Lease Funtionality', async () => {
//     await loginComponent.execute();
//     for(let data of t.fixtureCtx.data.addLease){
//         await addLeaseComponent.execute(data);
//     }         
// });


//  test('Search properties funtionality', async () => {
//     await loginComponent.execute();
//     for(let data of t.fixtureCtx.data.search){
//         await searchComponent.execute(data);
//     }         
// });

test('Add Single properties funtionality', async () => {
    await loginComponent.execute();
    await addPropertyComponent.execute(t.fixtureCtx.data.addSingleProperty[0]);
});

// test('Add Multiple properties funtionality', async () => {
//     await loginComponent.execute();
//     for(let data of t.fixtureCtx.data.addNewProperty) {
//         await addPropertyComponent.execute(data);
//     }
// });


