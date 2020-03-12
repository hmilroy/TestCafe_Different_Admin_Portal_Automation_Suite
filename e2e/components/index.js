/**
 * @file Class make the entry to all the components. Components are reusable entities which are re-used in entire
 * project.
 */
'use strict';

const helpers = require('require-all')({
    dirname     :  __dirname,
    filter      :  /(.+Component)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : false
});

module.exports = helpers;