/**
 * @file Helper class for manipulate all the configurations.
 */
'use strict';

import fs from 'fs';
import path from 'path';

let configData = null;

function init() {
    let environment = process.env.NODE_ENV || 'default';

    let rawConfig = fs.readFileSync(`${path.resolve(__dirname)}/../../config/default.json`);
    configData = JSON.parse(rawConfig);

    if (environment !== 'default') {
        let selectedConfig = fs.readFileSync(`${path.resolve(__dirname)}/../../config/${environment}.json`);
        configData = Object.assign({}, configData, JSON.parse(selectedConfig));
    }

    return configData;
};

init();

module.exports = configData;