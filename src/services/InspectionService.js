import request from 'reqwest';
import when from 'when';

import URL from '../constants/URLConstants';
import AuthStore from '../stores/LoginStore';

class InspectionService {
    getInspectors() {
        return this.handleRequest(when(request({
            url: URL.GET_INSPECTORS,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    getInspections(id) {
        return this.handleRequest(when(request({
            url: URL.GET_ALL_INSPECTIONS + id,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    deleteInspection(inspection_id) {
        return this.handleRequest(when(request({
            url: URL.GET_INSPECTION + inspection_id,
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
                if (inData.file.type === 'application/pdf') {
                    data.append("PDF_1", inData.file);
                }
            }
            if (inData.property_id) {
                data.append("property_id", inData.property_id);
            }
            if (inData.user_id) {
                data.append("user_id", inData.user_id);
            }
            if (inData.inspection_type) {
                data.append("inspection_type", inData.inspection_type);
            }
            if (inData.inspected_at) {
                data.append("inspected_at", inData.inspected_at);
            }
            if (inData.inspection_report_id) {
                data.append("inspection_report_id", inData.inspection_report_id);
            }
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            // On Success
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 300) {
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

            xhr.open(method, URL.GET_INSPECTION);
            xhr.setRequestHeader("Authorization", AuthStore.jwt);
            xhr.send(data);
        });
    }

    handleRequest(promise) {
        return promise;
    }
}

export default new InspectionService()