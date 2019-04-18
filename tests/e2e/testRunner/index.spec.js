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

const loginComponent = new components.loginComponent();
const addPropertyComponent = new components.addPropertyComponent();
const searchComponent = new components.searchComponent();
const addLeaseComponent = new components.addLeaseComponent();
const addPersonComponent = new components.addPersonComponent();
const addTenantComponent = new components.addTenantComponent();
const addInspectionsComponent = new components.addInspectionsComponent();
const keysComponent = new components.keysComponent();



test('End to End test', async () => {
    await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
    for(var i=0; i<10;i++){
    await addPropertyComponent.execute(t.fixtureCtx.data.addMultilpeProperties[3]);
    await addLeaseComponent.execute(t.fixtureCtx.data.addLease[3]);
    await addTenantComponent.execute(t.fixtureCtx.data.addTenant[3]);
    console.log("Property create completed");
    }

}
);

// test('Add inspections funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addInspections) {
//         await addInspectionsComponent.execute(data);
//     }
// });



// test('Add keys funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     await keysComponent.execute(t.fixtureCtx.data.keys[0]);
//     }
// );

// test('Add Multiple properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addMultilpeProperties) {
//         await addPropertyComponent.execute(data);
//     }
// });

// test('Add Lease Funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addLease) {
//         await addLeaseComponent.execute(data);
//     }
// });

// test('Add Tenant Funtionality', async () => {
//     await loginComponent.execute();
//     for (let data of t.fixtureCtx.data.addTenant) {
//         await addTenantComponent.execute(data);
//     }
// });


// test('Add person funtionality', async () => {
//     await loginComponent.execute();
//     for (let data of t.fixtureCtx.data.addPerson) {
//         await addPersonComponent.execute(data);
//     }
// });



//  test('Search properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for(let data of t.fixtureCtx.data.search){
//         await searchComponent.execute(data);
//     }         
// });

// test('Add Single properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     await addPropertyComponent.execute(t.fixtureCtx.data.addSingleProperty[0]);
// });






