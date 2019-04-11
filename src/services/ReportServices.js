import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import PropertyActions from '../actions/ProepertyActions';
import Moment from 'moment';
import LoginStore from '../stores/LoginStore';
import requestPromise from 'request-promise';
import only from 'only';

class RenewalsService {

    search() {
        return this.handleRequest(when(request({
            url: URL.PROPERTY_MAINTENANCE_URL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json'
        })));
    }

    handleRequest(promiseTable) {
        return promiseTable;
    }

    getLeaseRenewals(limit = 50, page = 1) {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.LEASE_RENEWALS,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }
    getLandlordInsurance(limit = 50, page = 1) {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.LANDLORD_INSURANCE,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }
    getPropertiesWon() {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.PROPERTIES_WON,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }
    getUpcomingOpenhomes() {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.UPCOMING_OPEN_HOMES,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }
    getPropertiesAvailableToLet() {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.PROPERTIES_AVAILABLE_TO_LET,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }

    getShownByList() {
        return this.handleAllProperties(when(request({
            url: URL.REPORTS.GET_SHOWN_BY_LIST,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
    }

    getAccessNote(property_id) {
        return this.handleAllProperties(when(request({
            url: URL.PROPERTY_KEYS + property_id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json'
        })));
    }

    updateAccessNote(data) {
        return this.handleAllProperties(when(request({
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

    markedAsLeased(data) {
        return this.handleAllProperties(when(request({
            url: URL.VACANCY,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: data,
            type: 'json'
        })), data)
    }

    addOpenHome(data) {
        return this.handleAllProperties(when(request({
            url: URL.OPEN_HOME,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: data,
            type: 'json'
        })), data)
    }
  
    getOpenVerbals() {

        return when.promise(resolve => {
                resolve(request({
                    url: URL.REPORTS.PROPERTIES_OPEN_VERBALS,
                    method: 'GET',
                    crossOrigin: true,
                    headers: {
                        'Authorization': LoginStore.jwt
                    },
                    type: 'json'
                }))
            }
        );
    }

    handleAllProperties(promiseTable) {
        return promiseTable;
    }

    viewProperty(id) {
        let jwt = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : LoginStore.jwt;
        return this.handleFindProperty(when(request({
            url: URL.FIND_PROPERTY + id + '/all',
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': jwt
            },
            type: 'json',
        })));
    }

    handleFindProperty(propertyPromise) {
        propertyPromise.then((res) => {
            PropertyActions.loadProperty(res);
        });
        return propertyPromise;
    }

}

export default new RenewalsService()
