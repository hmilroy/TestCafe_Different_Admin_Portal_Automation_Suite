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
const addSupplierComponent = new components.addSupplierComponent();
const addTenantComponent = new components.addTenantComponent();
const addInspectionsComponent = new components.addInspectionsComponent();
const keysComponent = new components.keysComponent();
const propertyTabComponent = new components.propertyTabComponent();



////-------(Working correctly)
// test('End to End test >> Property create', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for(var i=0; i<10;i++){
//     await addPropertyComponent.execute(t.fixtureCtx.data.addMultilpeProperties[0]);
//     await addLeaseComponent.execute(t.fixtureCtx.data.addLease[0]);
//     await addTenantComponent.execute(t.fixtureCtx.data.addTenant[0]);
//     await keysComponent.execute(t.fixtureCtx.data.keys[0]);

//     console.log("Property create completed");
//     }

// }
// );

////-------(Working correctly)
// test('Add Supplier funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addSupplier) {
//         await addSupplierComponent.execute(data);
//     }
// });


//--------(Working correctly)
test('Add keys funtionality', async () => {
    await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
    await keysComponent.execute(t.fixtureCtx.data.keys[0]);
    }
);


// //-------(Working correctly)
//  test('Search properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for(let data of t.fixtureCtx.data.search){
//         await searchComponent.execute(data);
//     }         
// });

// //--------(Working correctly)
// test('Fill Property Tab funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     await propertyTabComponent.execute(t.fixtureCtx.data.propertyTab[0]);
//     }
// );


// //--------(Working correctly)
// test('Add Single properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     await addPropertyComponent.execute(t.fixtureCtx.data.addSingleProperty[0]);
// });


// //--------(Working correctly)
// test('Add Lease Funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addLease) {
//         await addLeaseComponent.execute(data);
//     }
// });

// //--------(Working correctly)
// test('Add Tenant Funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addTenant) {
//         await addTenantComponent.execute(data);
//     }
// });

// //--------(Working correctly)
// test('Add Multiple properties funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addMultilpeProperties) {
//         await addPropertyComponent.execute(data);
//     }
// });

//================================================================================================


// test('Add inspections funtionality', async () => {
//     await loginComponent.execute(t.fixtureCtx.data.userLogin[0]);
//     for (let data of t.fixtureCtx.data.addInspections) {
//         await addInspectionsComponent.execute(data);
//     }
// });




//test run command : testcafe chrome run e2e