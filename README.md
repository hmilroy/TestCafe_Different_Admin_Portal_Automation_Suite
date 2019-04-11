# Admin Portal - Different


## Introduction

> This repository contains all the different admin portal backend related source code.  

## Prerequisites

In order to test/work on this repo locally, you need to have following configured in your system.

1. node v6.10.0
2. npm 3.10.10
3. ruby 2.2.x
4. compass 1.0.3

## Installation

Initially clone the project from this repository.
```sh
$ git clone https://github.com/rehanfernando/different-admin-portal-frontend.git
```

Then go in to the to the cloned directory and install dependencies and build the project by running the following commands
```sh
$ cd different-admin-portal-frontend
$ npm install
$ npm run build
```

To run the project give the following command and go to 
[http://localhost:9000](http://localhost:9000) to view a production build of the application on your browser

```sh
$ npm prod
```

## Code/Folder Structure
This application contains following code/folder structure.
> Note: following folder structure is available inside the `src` folder, which is used for application development purpose.
* `actions/` - contains all flux dispatchers which are publishing app events using the AppDispatcher.
* `assets/` - contains all the images fonts and main stylesheets
* `components/` - contains all view components like Forms, Layouts and other Elements.
* `constants/` - Constant definitions to be used in the app
* `dispatchers/` - Has the main AppDispatcher which act as the base dispatcher to be used by Action Dispatchers
* `pages/` - Contains all the views and view logic for the application
* `services/` - contains services which fetch data from the stores to the views
* `stores/` - contains stores which has the latest data from the dispatchers
* `utility/` - place where any helper methods are defined


## Development 
Executing following command will start the app runing on your localhost and will rebuild files on code changes.

```sh
$ npm start
```

## Build

Build for Development
```sh
$ npm build
```

Build for qa

```sh
$ npm build-qa
```

Build app for production

```sh
$ npm build-prod
```
## E2E Testing with TestCafe

We use [TestCafe](https://github.com/DevExpress/testcafe) as our UI automation framework.


#### _Code/Folder Structure_

This testcafe project contains following code/folder structure.
* `config/` - contains all the configurations, each environment include separate configuration file.
* `libs/` - contains all the reusable entities
  * `libs/components/` - all the reusable test-case components, eg - _loginComponent.js_
  * `libs/components/BaseComponent.js` - abstract class which provide the blueprint for reusable component. This always extends in all child components.
* `helpers/` - contains all reusable helper classes
  * `helpers/configHelper.js` - contains all the methods which use for handling configurations
  * `helpers/dataHelper.js` - include methods which use for handling data from remote data resource(eg - Google Spreadsheet)
* `login/` - contains login related all the test-case files
* `uiObjects/` - include all the Uiobjects which stored as json files


You need to install TestCafe dev dependency before execute. For install TestCafe please execute following command.
```sh
$ npm install
```
or you can install TestCafe globally.
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
$ BROWSER=chrome npm run e2e
```

##### For Firefox
```sh
$ BROWSER=firefox npm run e2e
```
##### For Chrome Mobile Emulators
```sh
$ BROWSER="chrome:emulation:device=iphone 6" npm run e2e
```
If you are unable to execute npm commands, you can execute TestCafe directly.
```sh
$ node node_modules/testcafe/bin/testcafe.js $BROWSER tests/e2e/**/index.spec.js
```

##### Mobile and Remote Device Execution

If you need to run test cases in mobile or remote devices please execute following command, it will generate QR code then you can scan that and run test in your mobile device.
```sh
$ npm run e2e-remote
```
E2E  tests are powered with <img src="http://mherman.org/assets/img/blog/testcafe.png" alt="TestCafe" width="100">

<br>