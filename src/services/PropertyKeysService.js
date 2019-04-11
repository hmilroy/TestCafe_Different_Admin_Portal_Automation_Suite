import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import _ from 'underscore';
import Toastr from 'toastr';
import PropertyKeysAction from '../actions/PropertyKeysAction';

class PropertyKeysService {
    fetchKeys(property_id) {
        return this.handleFetchKeys(when(request({
            url: URL.PROPERTY_KEYS + property_id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json'
        })));
    }

    updateKeys(data) {
        return this.handleUpdateKeys(when(request({
            url: URL.PROPERTY_KEYS,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: data,
            type: 'json'
        })), data)

    }

    handleFetchKeys(promise) {
        promise.then((res) => {
            PropertyKeysAction.fetchKeys(res);
        })
        return promise;
    }

    handleUpdateKeys(promise, data) {
        promise.then((res) => {
            PropertyKeysAction.updateKeys(data);
        }).catch((error) => {
            // console.log('error', JSON.parse(error.response).status.message);
            Toastr.success(JSON.parse(error.response).status.message);
        });
        return promise;
    }
}


export default new PropertyKeysService()