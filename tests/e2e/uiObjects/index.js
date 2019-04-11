/**
 * @file Class make the entry to all the UI Objects.
  */
'use strict';

import _ from 'underscore';
import getValue from 'get-value';

const uiObjectsData = require('require-all')({
    dirname     :  __dirname,
    filter      :  /(.+Object)\.json$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : false
});

for (let uiObject in uiObjectsData) {
    let currentUiObject = uiObjectsData[uiObject];
    let updatedUiObject = {
        data: currentUiObject,
        get: function (path) {
            if (_.isUndefined(path) || _.isNull(path) || _.isEmpty(path)) {
                return getValue(currentUiObject);
            } else {
                return getValue(currentUiObject, path);
            }
        }
    };
    uiObjectsData[uiObject] = updatedUiObject;
};

module.exports = uiObjectsData;