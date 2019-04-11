/**
 * @file Helper class for get data from google spread sheet.
 */
'use strict';

import _string from 'underscore.string';
import GoogleSpreadsheet from 'google-spreadsheet';
import Promise from 'bluebird';

import config from './configHelper';

class dataHelper {
    constructor() {
        this.document = new GoogleSpreadsheet(config.data.sheetId);
    }

    get data() {
        const docAsync = Promise.promisifyAll(this.document);

        let result = {
            data: {},
            metadata: null
        };

        return docAsync.useServiceAccountAuthAsync(config.credentials.google).then(() => {
            return docAsync.getInfoAsync();
        }).then((sheetData) => {
            result.metadata = sheetData;

            let sheetPromises = [];
            sheetData.worksheets.forEach(sheetInfo => {
                sheetPromises.push(new Promise((resolve, reject) => {
                    let sheetInfoAync = Promise.promisifyAll(sheetInfo);

                    sheetInfoAync.getRowsAsync({
                        offset: 1
                    }).then(rows => {
                        let sheetName = _string.camelize(_string.slugify(_string.trim(sheetInfo.title)));
                        let rowData = [];
                        rows.forEach(row => {
                            // Remove unused data
                            delete row._xml;
                            delete row.id;
                            delete row['app:edited'];
                            delete row._links;

                            rowData.push(row);
                        });

                        result.data[sheetName] = rowData;
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });

                }));
            });

            return Promise.all(sheetPromises);
        }).then(() => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }
}

module.exports = dataHelper;