import request from 'reqwest';
import when from 'when';

import URL from '../constants/URLConstants';
import AuthStore from '../stores/LoginStore';

class LeaseService {

    getLease(propertyId) {
        return this.handleRequest(when(request({
            url: URL.LEASE.GET + propertyId,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    addLease(propertyId, lease) {

        return this.handleRequest(when(request({
            url: URL.LEASE.ADD + propertyId,
            method: 'PUT',
            crossOrigin: true,
            data: lease,
            type: 'json',
            headers: {
                'Authorization': AuthStore.jwt
            }
        })));
    }

    updateLease(data, id) {
        return this.handleRequest(when(request({
            url: URL.LEASE.UPDATE + id,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': AuthStore.jwt
            },
            data: data,
            type: 'json',
        })));
    }

    deleteLease(id) {
        return this.handleRequest(when(request({
            url: URL.LEASE.DELETE + id,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': AuthStore.jwt
            },
            type: 'json'
        })));
    }

    handleRequest(promise) {
        return promise;
    }
}

export default new LeaseService()