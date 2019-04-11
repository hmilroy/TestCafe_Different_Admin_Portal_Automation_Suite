/**
 * Created by bhanuka on 2/27/18.
 */
class CustomAddressService {

    customAddressify(addressObject) {
        let customAddress = {};
        if (!_.isUndefined(addressObject.addr_country_code)) {
            customAddress.countryCode = addressObject.addr_country_code;
        }
        if (!_.isUndefined(addressObject.addr_flat_number)) {
            customAddress.flatNumber = addressObject.addr_flat_number;
        }
        if (!_.isUndefined(addressObject.addr_flat_number_prefix)) {
            customAddress.flatNumberPrefix = addressObject.addr_flat_number_prefix;
        }
        if (!_.isUndefined(addressObject.addr_number_first)) {
            customAddress.numberFirst = addressObject.addr_number_first;
        }
        if (!_.isUndefined(addressObject.addr_number_last)) {
            customAddress.numberLast = addressObject.addr_number_last;
        }
        if (!_.isUndefined(addressObject.addr_post_code)) {
            customAddress.postCode = addressObject.addr_post_code;
        }
        if (!_.isUndefined(addressObject.addr_state)) {
            customAddress.state = addressObject.addr_state;
        }
        if (!_.isUndefined(addressObject.addr_street_name)) {
            customAddress.streetName = addressObject.addr_street_name;
        }
        if (!_.isUndefined(addressObject.addr_street_type)) {
            customAddress.streetType = addressObject.addr_street_type;
        }
        if (!_.isUndefined(addressObject.addr_suburb)) {
            customAddress.suburb = addressObject.addr_suburb;
        }
        return customAddress;
    }
}
export default new CustomAddressService();