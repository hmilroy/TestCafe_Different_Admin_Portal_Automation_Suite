import request from 'reqwest';
import when from 'when';

import URL from '../constants/URLConstants';
import AuthStore from '../stores/LoginStore';

class DocumentService {

    getAllCategory() {
        return this.handleRequest(when(request({
            url: URL.GET_DOCUMENT_CATEGORY,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    getDocuments(id) {
        return this.handleRequest(when(request({
            url: URL.GET_PROPERTY_DOCUMENT + id,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    getStatements(id) {
        return this.handleRequest(when(request({
            url: URL.GET_PROPERTY_STATEMENT + id,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    deleteDocuments(property, document) {
        return this.handleRequest(when(request({
            url: URL.GET_PROPERTY_DOCUMENT + property + '/' + document,
            method: 'DELETE',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    addDocument(inData, method) {
        return new Promise(function (resolve, reject) {
            let data = new FormData();
            if (inData.file) {
                if (inData.file.type == 'application/pdf') {
                    data.append("PDF_1", inData.file);
                } else {
                    data.append("IMG_1", inData.file);
                }

            }
            if (inData.category_id) {
                data.append("category_id", inData.category_id);
            }
            if (inData.property_id) {
                data.append("property_id", inData.property_id);
            }

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            // On Success
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if(this.status >= 200 && this.status < 300) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(JSON.parse(this.responseText));
                    }
                }
            });

            //On Error
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            xhr.open(method, URL.GET_PROPERTY_DOCUMENT);
            xhr.setRequestHeader("Authorization", AuthStore.jwt);
            xhr.send(data);
        });
    }

    addStatement(inData, method) {
        return new Promise(function (resolve, reject) {
            let data = new FormData();
            if (inData.file) {
                if (inData.file.type == 'application/pdf') {
                    data.append("PDF_1", inData.file);
                } else {
                    reject({
                        status: {
                            status: {
                                message: "Expected a PDF file!"
                            }
                        },
                        statusText: "Expected a PDF file!"
                    });
                }

            }
            if (inData.statement_id) {
                data.append("statement_id", inData.statement_id);
            }
            if (inData.property_id) {
                data.append("property_id", inData.property_id);
            }
            if (inData.year) {
                data.append("year", inData.year);
            }
            if (inData.month) {
                data.append("month", inData.month);
            }
            if (inData.statement_type) {
                data.append("statement_type", inData.statement_type);
            }

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            // On Success
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if(this.status >= 200 && this.status < 300) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(JSON.parse(this.responseText));
                    }
                }
            });

            //On Error
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            xhr.open(method, URL.UPLOAD_STATEMENT);
            xhr.setRequestHeader("Authorization", AuthStore.jwt);
            xhr.send(data);
        });
    }

    handleRequest(promise) {
        return promise;
    }
}

export default new DocumentService()