import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import PersonAction from '../actions/PersonActions';
import requestPromise from 'request-promise';
import PersonStore from '../stores/PersonStore';
import only from 'only';

class PersonService {

    findOne(id, userType) {
        let postFix = '';
        if(userType === 'owner' || userType === 'tenant') {
            postFix = '/ownership,tenancy';
        }

        return this.handleFind(when(request({
            url: URL.FIND_PERSON + userType + '/'+ id + postFix,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
        })));
    }

    findOneUser(id) {
        return this.handleFind(when(request({
            url: URL.FIND_PERSON + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
         })));
    }

    storePerson(person) {
        PersonAction.storePerson(person);
    }

    handleFind(responsePromise) {
        return responsePromise;
    }

    viewPerson(id, userType) {
        PersonAction.viewPerson(id,userType);
    }

    viewPersonRoles(id, email, name) {
        PersonAction.viewPersonRoles(id, email, name);
    }

    addRole(userId, userRole) {
        PersonAction.addRole(userId, userRole);
    }

    notAddingRole() {
        PersonAction.notAddingRole();
    }

    addOwner(data) {
        let requestOptions = {
            method: 'POST',
            uri: URL.ADD_PERSON,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };

        return requestPromise(requestOptions);
    }
    
    genareteOwnerLoginHash(userId) {
        let requestOptions = {
            method: 'GET',
            uri: URL.GENERATE_OWNER_LOGIN_HASH + userId,
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json'
        };

        return requestPromise(requestOptions);
    }

    addPersonManualAddress(person) {
        if (person.place_info_arg) { // fix for mappify issue
            person.place_info_arg = only(person.place_info_arg, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
                'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
                'streetType streetSuffixCode suburb state postCode location streetAddress');
        }
        let data = {};
        switch (person.user_type) {
            case 2:
                data.email = person.email;
                data.name = person.name;
                data.user_type = person.user_type;
                data.country_code = person.country_code.toUpperCase();
                data.tel_number = person.tel_number;
                data.property_id = person.property_id;
                data.place_info = person.place_info_arg;
                break;
            case 3:
                data.email = person.email;
                data.name = person.name;
                data.user_type = person.user_type;
                data.country_code = person.country_code.toUpperCase();
                data.tel_number = person.tel_number;
                data.property_id = person.property_id;
                break;
            case 4:
                data.place_info = person.place_info_arg;
                if (person.tradie_category_id) {
                    data.email = person.email;
                    data.name = person.name;
                    data.user_type = person.user_type;
                    data.country_code = person.country_code.toUpperCase();
                    data.tel_number = person.tel_number;
                    data.company_name = person.company_name;
                    data.website_url = person.website_url;
                    data.tradie_category_id = person.tradie_category_id;
                } else {
                    data.email = person.email;
                    data.name = person.name;
                    data.user_type = person.user_type;
                    data.country_code = person.country_code.toUpperCase();
                    data.tel_number = person.tel_number;
                    data.company_name = person.company_name;
                    data.website_url = person.website_url;
                    data.tradie_category_name = person.tradie_category_name;
                }
                break;
            case 5:
                data.email = person.email;
                data.name = person.name;
                data.user_type = person.user_type;
                data.country_code = person.country_code.toUpperCase();
                data.tel_number = person.tel_number;
                data.property_id = person.property_id;
                data.place_info = person.place_info_arg;
                break;
            case 6:
                data.email = person.email;
                data.name = person.name;
                data.user_type = person.user_type;
                data.country_code = person.country_code.toUpperCase();
                data.tel_number = person.tel_number;
                data.property_id = person.property_id;
                data.place_info = person.place_info_arg;
                data.company_name = person.company_name;
                break;
            case 7:
                data.place_info = person.place_info_arg;
                data.email = person.email;
                data.name = person.name;
                data.user_type = person.user_type;
                data.country_code = person.country_code.toUpperCase();
                data.tel_number = person.tel_number;
                break;
        }
        if (!_.isUndefined(person.custom_address)) {
            delete data.place_info;
            data.custom_address_info = person.custom_address;
        }

        let requestOptions = {
            method: 'POST',
            uri: URL.ADD_PERSON,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };

        return requestPromise(requestOptions);
    }

    addPerson(email, name, user_type, country_code, tel_number, property_id, place_info_arg, company_name, website_url,
              tradie_category_name, tradie_category_id) {

        let data = {};
        let place_info = only(place_info_arg, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
            'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
            'streetType streetSuffixCode suburb state postCode location streetAddress');
        switch (user_type) {
            case 2:
                data.email = email;
                data.name = name;
                data.user_type = user_type;
                data.country_code = country_code.toUpperCase();
                data.tel_number = tel_number;
                data.property_id = property_id;
                data.place_info = place_info_arg;
                break;
            case 3:
                data.email = email;
                data.name = name;
                data.user_type = user_type;
                data.country_code = country_code.toUpperCase();
                data.tel_number = tel_number;
                data.property_id = property_id;
                break;
            case 4:
                if (tradie_category_id) {
                    data.email = email;
                    data.name = name;
                    data.user_type = user_type;
                    data.country_code = country_code.toUpperCase();
                    data.tel_number = tel_number;
                    data.company_name = company_name;
                    data.website_url = website_url;
                    data.tradie_category_id = tradie_category_id;
                } else {
                    data.email = email;
                    data.name = name;
                    data.user_type = user_type;
                    data.country_code = country_code.toUpperCase();
                    data.tel_number = tel_number;
                    data.company_name = company_name;
                    data.website_url = website_url;
                    data.tradie_category_name = tradie_category_name;
                }
                break;
            case 5:
                data.email = email;
                data.name = name;
                data.user_type = user_type;
                data.country_code = country_code.toUpperCase();
                data.tel_number = tel_number;
                data.property_id = property_id;
                data.place_info = place_info;
                break;
            case 6:
                data.email = email;
                data.name = name;
                data.user_type = user_type;
                data.country_code = country_code.toUpperCase();
                data.tel_number = tel_number;
                data.property_id = property_id;
                data.place_info = place_info;
                data.company_name = company_name;
                break;
            case 7:
                data.email = email;
                data.name = name;
                data.user_type = user_type;
                data.country_code = country_code.toUpperCase();
                data.tel_number = tel_number;
                break;
        }

        let requestOptions = {
            method: 'POST',
            uri: URL.ADD_PERSON,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };

        return requestPromise(requestOptions);
    }

    handleAddPerson(personPromise) {
        return personPromise;
    }

    updatePerson(person) {
        if (person.local_place_info) { // fix for mappify issue
            person.local_place_info = only(person.local_place_info, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
                'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
                'streetType streetSuffixCode suburb state postCode location streetAddress');
        } 
        let requestOptions = {
            method: 'PUT',
            uri: URL.FIND_PERSON + PersonStore.type,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: person,
            json: true
        };

        return requestPromise(requestOptions);
    }

    updatePeople(person, type) {
        if (person.local_place_info) { // fix for mappify issue
            person.local_place_info = only(person.local_place_info, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
                'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
                'streetType streetSuffixCode suburb state postCode location streetAddress');
        }
      if (person.place_info) { // fix for mappify issue
        person.place_info = only(person.place_info, 'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber ' +
          'numberFirst numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix streetName ' +
          'streetType streetSuffixCode suburb state postCode location streetAddress');
      }
      let requestOptions = {
            method: 'PUT',
            uri: URL.FIND_PERSON +type,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: person,
            json: true
        };

        return requestPromise(requestOptions);
    }

    resendSignupEmail(id) {

        let data = {};
        if (id) {
            data.owner_id = id;
        }
        let requestOptions = {
            method: 'POST',
            uri: URL.RESEND_SIGNUP_EMAIL,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };

        return requestPromise(requestOptions);
    }

    getuserPaymentInfo(id) {
        let requestOptions = {
            method: 'GET',
            uri: URL.GET_USER_PAYMENT_INFO + id,
            headers: {
              'content-type': 'application/json',
              'Authorization': localStorage.getItem('jwt')
            },
            json: true
        };

        return requestPromise(requestOptions);
    }
}

export default new PersonService()