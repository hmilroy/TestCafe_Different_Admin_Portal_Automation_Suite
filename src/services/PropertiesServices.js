import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import PropertyActions from '../actions/ProepertyActions';
import Moment from 'moment';
import LoginStore from '../stores/LoginStore';
import requestPromise from 'request-promise';
import only from 'only';

class PropertyService {

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

    getAllProperties(limit = 50, page = 1) {
        return this.handleAllProperties(when(request({
            url: URL.ALL_PROPERTY + '/' + limit + '/' + page,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })));
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

    getPaymentSchedule(id) {
        return this.handleFindProperty(when(request({
            url: URL.PAYMENT + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
        })));
    }

    findProperty(id) {
        return this.handleFindProperty(when(request({
            url: URL.FIND_PROPERTY + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json',
        })));
    }

    updateProperty(payload) {
        let data = {};

        if (payload.sale_price) {
            data.sale_price = payload.sale_price;
        }
        if (payload.bedrooms) {
            data.bedrooms = payload.bedrooms;
        }
        if (payload.bathrooms) {
            data.bathrooms = payload.bathrooms;
        }
        if (payload.parking) {
            data.parking = payload.parking;
        }
        if (payload.type) {
            data.type = payload.type;
        }
        if (!_.isUndefined(payload.has_tenant_at_management_start)) {
            data.has_tenant_at_management_start = payload.has_tenant_at_management_start;
        }
        if(!_.isUndefined(payload.agreement_start_at) && !_.isNull(payload.agreement_start_at)) {
            data.agreement_start_at = Moment(payload.agreement_start_at).format("YYYY-MM-DD");;
        }
        data.swimming_pool = Boolean(payload.swimming_pool);
        data.strata_managed = Boolean(payload.strata_managed);
        data.previous_property_manager = Boolean(payload.previous_property_manager);
        data.water_efficiency_devices = Boolean(payload.water_efficiency_devices);
        data.water_seperately_metered = Boolean(payload.water_seperately_metered);
        data.built_prior_to_1980 = Boolean(payload.built_prior_to_1980);
        data.is_test_property = Boolean(payload.is_test_property);

        return this.handleUpdateProperty(when(request({
            url: URL.FIND_PROPERTY + payload.id,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: data,
            type: 'json',
        })));

    }

    updatePropertyRent(payload, id) {

        let data= {};

        data.holding_deposit = payload.holding_deposit;
        if(payload.current_weekly_rent) {
            data.current_weekly_rent =payload.current_weekly_rent;
        }

        if (payload.lease_start_date) {
            data.lease_start_date = Moment(payload.lease_start_date).format("YYYY-MM-DD");
        }
        if (payload.lease_end_date) {
            data.lease_end_date = Moment(payload.lease_end_date).format("YYYY-MM-DD");
        }
        if (payload.agreement_start_at) {
            data.agreement_start_at = Moment(payload.agreement_start_at).format("YYYY-MM-DD");
        }
        if (payload.rent_paid_until_date) {
            data.rent_paid_until_date = Moment(payload.rent_paid_until_date).format("YYYY-MM-DD");
        }
        if (payload.payment_plan_id) {
            data.payment_plan_id = payload.payment_plan_id;
        }
        if (payload.payment_debit_date) {
            data.payment_debit_date = payload.payment_debit_date;
        }
        // if (!_.isUndefined(payload.has_tenant_at_management_start)) {
        //     data.has_tenant_at_management_start= payload.has_tenant_at_management_start;
        // }
        if (!_.isUndefined(payload.bond_reference_number)) {
            data.bond_reference_number = payload.bond_reference_number;
        }

        return this.handleUpdateProperty(when(request({
            url: URL.RENT_UPDATE_PROPERTY + id,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: data,
            type: 'json',
        })));

    }

    addNewProperty(owner_email, owner_name, place_info, owner_id, is_custom_address, is_test_property) {


        let data = {};
        if(is_custom_address) {
            data.custom_address_info = only(place_info, 'flatNumberPrefix flatNumber numberFirst numberLast streetName ' +
              'streetType suburb state postCode countryCode');
        } else {
            data.place_info = only(place_info, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
              'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
              'streetType streetSuffixCode suburb state postCode location streetAddress');
        }

        if (owner_id) {
            data.owner_id = owner_id;
            data.owner_email = owner_email;
            data.owner_name = owner_name;
        } else {
            data.owner_email = owner_email;
            data.owner_name = owner_name;
        }
        data.is_test_property = is_test_property;

        let requestOptions = {
            method: 'POST',
            uri: URL.ADD_PROPERTY,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };

        return requestPromise(requestOptions);
    }

    propertySuggestion(query) {
        return this.handlePropertySuggestions(when(request({
            url: URL.AUTO_COMPLETE,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    propertySuggestionGlobal(query, country) {
        return this.handlePropertySuggestions(when(request({
            url: URL.AUTO_COMPLETE_GLOBAL + '/' + country,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    addressSelected(placeId) {
        PropertyActions.addressSelected(placeId);
    }

    handleFindProperty(propertyPromise) {
        propertyPromise.then((res) => {
            PropertyActions.loadProperty(res);
        });
        return propertyPromise;
    }

    handleUpdateProperty(propertyPromise) {
        return propertyPromise;
    }

    handleAddProperty(propertyPromise) {
        return propertyPromise;
    }

    handlePropertySuggestions(propertyPromise) {
        return propertyPromise;
    }


}

export default new PropertyService()