# TestCafe Automation Suite for Different Admin Portal

This is TestCafe Automation Suite for Different Admin Portal, this framework rich with lots of features (ex- Data Handling, Config Handling and etc) which helps engineers to continue their tasks easily.

We use [TestCafe](https://github.com/DevExpress/testcafe) as our UI automation framework.


#### _Code/Folder Structure_//test

This testcafe project contains following code/folder structure.
* `components/` - contains all the reusable entities
  * `components/` - all the reusable test-case components, eg - _loginComponent.js_
  * `components/BaseComponent.js` - abstract class which provide the blueprint for reusable component. This always extends in all child components.
* `config/` - contains all the configurations, each environment include separate configuration file.
* `libs/helpers/` - contains all reusable helper classes
  * `libs/helpers/configHelper.js` - contains all the methods which use for handling configurations
  * `libs/helpers/dataHelper.js` - include methods which use for handling data from remote data resource(eg - Google Spreadsheet)
* `uiObjects/` - include all the Uiobjects which stored as json files


Initially clone the project from this repository.
```sh
$ git clone https://github.com/hmilroy/TestCafe-different-admin-portal-framework.git
```

Then go in to the to the cloned directory and install dependencies and build the project by running the following commands
```sh
$ cd TestCafe-project
$ npm install
```

you can install TestCafe globally using following command.
```sh
$ npm install -g testcafe
```

After installation you can execute following command to run end-to-end(E2E) test in all browsers.
```sh
$ npm run e2e
```

If you only need to run in specific browser please execute with browser name as following command.

##### For Chrome
```sh
$ testcafe chrome e2e
```
##### For Firefox
```sh
$ testcafe firefox e2e
```
##### Run tests with HTML Reporting
$ testcafe chrome run e2e --reporter html:/home/milroy/TestCafe_Different_Admin_Portal_Automation_Suite/test-reports/Report_Name.html

##### For Chrome Mobile Emulators
```sh
$ testcafe chrome::emulation:device=iphone 6 run e2e
<<<<<<< HEAD
=======
```
##### Remote Device Execution

If you need to run test cases in remote devices please execute following command, it will generate URL then you can navigate to that and run test in your remote device.
```sh
$ testcafe remote e2e  
>>>>>>> 9b8b6960cc4b6a3b3b2e76f631a99df04d6d05ed
```
##### Remote Device Execution

<<<<<<< HEAD
If you need to run test cases in remote devices please execute following command, it will generate URL then you can navigate to that and run test in your remote device.
```sh
$ testcafe remote e2e  
```
E2E  tests are powered with <img src="http://mherman.org/assets/img/blog/testcafe.png" alt="TestCafe" width="100">

##### Mobile Device Execution using QR Code
If you need to run test cases in mobile devices please execute following command, it will generate QR code then you can scan that and run test in your mobile device
```sh
$ testcafe remote e2e --qr-code

=======

##### Mobile Device Execution using QR Code
If you need to run test cases in mobile devices please execute following command, it will generate QR code then you can scan that and run test in your mobile device
```sh
$ testcafe remote e2e --qr-code
```
E2E  tests are powered with <img src="http://mherman.org/assets/img/blog/testcafe.png" alt="TestCafe" width="100">
>>>>>>> 9b8b6960cc4b6a3b3b2e76f631a99df04d6d05ed
<br>
