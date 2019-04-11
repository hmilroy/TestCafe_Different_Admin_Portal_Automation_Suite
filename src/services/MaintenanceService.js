import request from 'reqwest';
import when from 'when';

import URL from '../constants/URLConstants';
import AuthStore from '../stores/LoginStore';

class UserService {

    getAllMaintenance(page) {
        return this.handleRequest(when(request({
            url: URL.GET_ALL_MAINTENANCE + '10/' + page,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    getMaintenance(id) {
        return this.handleRequest(when(request({
            url: URL.GET_PROPERTY_MAINTENANCE + id,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    getQuoteDetals(hash) {
        return this.handleRequest(when(request({
            url: URL.GET_QUOTE_DETAILS + hash,
            method: 'GET',
            crossOrigin: true,
            type: 'json'
        })));
    }

    putQuoteDetails(data) {
        return this.handleRequest(when(request({
            url: URL.PUT_QUOTE_DETAILS,
            method: 'PUT',
            crossOrigin: true,
            data: data,
            type: 'json'
        })));
    }

    putQuoteComplete(inData) {
        let data = new FormData();
        if(inData.IMG_1) {
            data.append("IMG_1", inData.IMG_1[0]);
        }
        if(inData.other_quote) {
            data.append("other_quote", inData.other_quote);
        }
        if(inData.other_quote_name) {
            data.append("other_quote_name", inData.other_quote_name);
        }
        if(inData.note) {
            data.append("note", inData.note);
        }

        data.append("parts_cost", inData.parts_cost);
        data.append("labour_cost", inData.labour_cost);
        data.append("completed_date", inData.completed_date);
        data.append("completed_time", inData.completed_time);
        data.append("identifier", inData.identifier);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                return true;
            }
        });

        xhr.open("PUT", URL.PUT_QUOTE_COMPLETE);
        xhr.send(data);
    }

    handleRequest(promise) {
        return promise;
    }
}

export default new UserService()