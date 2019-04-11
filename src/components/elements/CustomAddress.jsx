import React, {Component} from 'react';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import PropertySingleInput from './PropertySingleInput.jsx';
import CustomAddressService from '../../services/CustomAddressService';
import Countries from '../../../data/countries.json';
import States from '../../../data/country_states/states.json';

class CustomAddress extends Component {

    constructor(props) {
        super(props);

        let countryDisabled = false;
        if (!_.isUndefined(props.countryDisabled)) {
            countryDisabled = props.countryDisabled;
        }

        this.state = {
            inputClass: props.inputWrapClass + ' form-input',
            flatNumberPrefix: '',
            flatNumber: '',
            numberFirst: '',
            numberLast: '',
            streetName: '',
            streetType: '',
            suburb: '',
            postCode: '',
            countryCode: 'AU',
            state: '',
            customAddress: {},
            countryDisabled
        };
        this.handleFlatNumberPrefixChange = this.handleFlatNumberPrefixChange.bind(this);
        this.handleFlatNumberChange = this.handleFlatNumberChange.bind(this);
        this.handleFirstNumberChange = this.handleFirstNumberChange.bind(this);
        this.handleLastNumberChange = this.handleLastNumberChange.bind(this);
        this.handleStreetNameChange = this.handleStreetNameChange.bind(this);
        this.handleStreetTypeChange = this.handleStreetTypeChange.bind(this);
        this.handleSuburbChange = this.handleSuburbChange.bind(this);
        this.handlePostCodeChange = this.handlePostCodeChange.bind(this);
        this.handleCountryCodeChange = this.handleCountryCodeChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.updateCustomAddress = this.updateCustomAddress.bind(this);
        this.populateCustomAddress = this.populateCustomAddress.bind(this);
        this.extractCustomAddress = this.extractCustomAddress.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
    }

    componentDidMount() {
        // this.populateCustomAddress();
        // Getting Custom Address for edits
        if (!(_.isNull(this.props.value) || _.isUndefined(this.props.value))) {
            let customAddress = this.emptyIfNull(this.props.value);

            this.setState({
                customAddress: customAddress
            }, () => {
                this.extractCustomAddress();
            });
        }
    }

    emptyIfNull(obj) {
        let nullRemovedObject = _.clone(obj);
        Object.getOwnPropertyNames(obj).forEach((propName)=> {
           if (_.isNull(obj[propName])) {
               nullRemovedObject[propName] = '';
           }
        });
        return nullRemovedObject;
    }

    populateCustomAddress() {
        let customAddress = {};
        customAddress.flatNumberPrefix = this.state.flatNumberPrefix;
        customAddress.flatNumber = this.state.flatNumber;
        customAddress.numberFirst = this.state.numberFirst;
        customAddress.numberLast = this.state.numberLast;
        customAddress.streetName = this.state.streetName;
        customAddress.streetType = this.state.streetType;
        customAddress.suburb = this.state.suburb;
        customAddress.postCode = this.state.postCode;
        customAddress.countryCode = this.state.countryCode;
        customAddress.state = this.state.state;
    }

    extractCustomAddress() {
        this.setState(this.state.customAddress);
    }

    handleCountryChange(e) {
        this.setState({
            countryCode: e.target.value
        });
    }

    updateCustomAddress(key, value) {
        let customAddress = _.clone(this.state.customAddress);
        customAddress[key] = value;
        let self = this;
        this.setState({customAddress}, function(){
        });
        // this.props.onChangeAddress(customAddress);

        let outputAddress = {};
        if (!_.isEmpty(this.state.numberFirst)) {
            outputAddress.numberFirst = this.state.numberFirst;
        }
        if (!_.isEmpty(this.state.streetName)) {
            outputAddress.streetName = this.state.streetName;
        }
        if (!_.isEmpty(this.state.suburb)) {
            outputAddress.suburb = this.state.suburb;
        }
        if (!_.isEmpty(this.state.postCode)) {
            outputAddress.postCode = this.state.postCode;
        }
        if (!_.isEmpty(this.state.countryCode)) {
            outputAddress.countryCode = this.state.countryCode;
        }
        if (this.state.state !== '' && !_.isNull(this.state.state)) {
            outputAddress.state = this.state.state;
        }
        if (!_.isEmpty(this.state.flatNumberPrefix)) {
            outputAddress.flatNumberPrefix = this.state.flatNumberPrefix;
        }
        if (!_.isEmpty(this.state.flatNumber)) {
            outputAddress.flatNumber = this.state.flatNumber;
        }
        if (!_.isEmpty(this.state.numberLast)) {
            outputAddress.numberLast = this.state.numberLast;
        }
        if (!_.isEmpty(this.state.streetType)) {
            outputAddress.streetType = this.state.streetType;
        }

        this.props.onChangeAddress(outputAddress);
    }

    handleFlatNumberPrefixChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            flatNumberPrefix: value
        }, () => {
            self.updateCustomAddress('flatNumberPrefix', value);
        });
    }

    handleFlatNumberChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            flatNumber: value
        }, () => {
            self.updateCustomAddress('flatNumber', value);
        });
    }

    handleFirstNumberChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            numberFirst: value
        }, () => {
            self.updateCustomAddress('numberFirst', value);
        });
    }

    handleLastNumberChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            numberLast: value
        }, () => {
            self.updateCustomAddress('numberLast', value);
        });
    }

    handleStreetNameChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            streetName: value
        }, () => {
            self.updateCustomAddress('streetName', value);
        });
    }

    handleStreetTypeChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            streetType: value
        }, () => {
            self.updateCustomAddress('streetType', value);
        });
    }

    handleSuburbChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            suburb: value
        }, () => {
            self.updateCustomAddress('suburb', value);
        });
    }

    handlePostCodeChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            postCode: value
        }, () => {
            self.updateCustomAddress('postCode', value);
        });
    }

    handleCountryCodeChange(e) {
        let self = this;
        let value = e.target.value;

        let states = States[value];
        if (states.length < 1) {
            this.setState({
                state: ' '
            });
            self.updateCustomAddress('state', ' ');
        }

        this.setState({
            countryCode: value
        }, () => {
            self.updateCustomAddress('countryCode', value);
        });
    }

    handleStateChange(e) {
        let self = this;
        let value = e.target.value;
        this.setState({
            state: value
        }, () => {
            self.updateCustomAddress('state', value);
        });
    }

    render() {
        const states = States[this.state.countryCode];
        let poboxRequird = false;
        if (this.state.flatNumber) {
            poboxRequird = true;
        }

        let streetRequired = false;
        if (this.state.flatNumberPrefix !== "PO Box") {
            streetRequired = true
        }

        let unitOrPoBoxRequired = false;
        if (!_.isEmpty(this.state.flatNumberPrefix)) {
            unitOrPoBoxRequired = true
        }

        return (
            <div className="custom-address-comp">
                <div className="form-group row element main-selection">
                    <label className={this.props.labelWrapClass}>Unit or PO Box</label>
                    <div className={this.props.inputWrapClass}>
                        <div className="row input_field">
                            <select
                                required={poboxRequird}
                                name="type"
                                className="grouped-select col-xs-4 col-sm-4 col-md-4 formInput formInput--first"
                                disabled={false}
                                value={this.state.flatNumberPrefix}
                                onChange={this.handleFlatNumberPrefixChange}>
                                <option value="">Select Type</option>
                                <option value="Unit">Unit</option>
                                <option value="PO Box">PO Box</option>
                                <option value="Suite">Suite</option>
                            </select>
                            <input
                                required={unitOrPoBoxRequired}
                                className="col-xs formInput formInput--last"
                                value={this.state.flatNumber}
                                onChange={this.handleFlatNumberChange}
                            />
                        </div>
                    </div>

                </div>

                <div className="form-group row element main-selection">
                    <label className={this.props.labelWrapClass}>Number</label>
                    <div className={this.props.inputWrapClass}>
                        <div className="row input_field">
                            <input
                                required={streetRequired}
                                className={'form-input col-xs-5'}
                                value={this.state.numberFirst}
                                onChange={this.handleFirstNumberChange}
                            />
                            <span className="dashed-place col-xs">-</span>
                            <input
                                className="form-input col-xs-5"
                                value={this.state.numberLast}
                                onChange={this.handleLastNumberChange}
                            />
                        </div>
                    </div>

                </div>

                <div className="form-group row element main-selection">
                    <label className={this.props.labelWrapClass}>Street</label>
                    <div className={this.props.inputWrapClass}>
                        <div className="row input_field">
                            <input
                                required={streetRequired}
                                className={'col-xs formInput formInput--first'}
                                value={this.state.streetName}
                                onChange={this.handleStreetNameChange}
                            />
                            <select
                                name="streetType"
                                className="grouped-select col-xs-4 col-sm-4 col-md-4 formInput formInput--last"
                                disabled={false}
                                required={streetRequired}
                                value={this.state.streetType}
                                onChange={this.handleStreetTypeChange}>
                                <option value="">Select Type</option>
                                <option value="Avenue">Ave</option>
                                <option value="Street">Street</option>
                                <option value="Road">Road</option>
                                <option value="Drive">Drive</option>
                                <option value="Lane">Lane</option>
                                <option value="Quay">Quay</option>
                                <option value="Place">Place</option>
                                <option value="Highway">Highway</option>
                                <option value="Parade">Parade</option>
                                <option value="Way">Way</option>
                                <option value="Crescent">Crescent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <PropertySingleInput
                    labelWrapClass={this.props.labelWrapClass}
                    inputWrapClass={this.state.inputClass+' add-person-nput-width'}
                    inputType={'text'}
                    title={'Suburb'}
                    name={'suburb'}
                    controlFunc={this.handleSuburbChange}
                    content={this.state.suburb}/>

                <PropertySingleInput
                    labelWrapClass={this.props.labelWrapClass}
                    inputWrapClass={this.state.inputClass+' add-person-nput-width'}
                    inputType={'text'}
                    title={'Post Code'}
                    name={'postCode'}
                    controlFunc={this.handlePostCodeChange}
                    content={this.state.postCode}/>

                <div className="form-group row element main-selection">
                    <label className={this.props.labelWrapClass}>Country / State</label>
                    <div className={this.props.inputWrapClass}>
                        <div className="row input_field">
                            <div className="col-xs-5 countrySelect__wrapper">
                                <select value={this.state.countryCode}
                                        disabled={this.state.countryDisabled}
                                        required
                                        onChange={this.handleCountryCodeChange}>
                                    {Countries.map((country, index)=>{
                                       return <option key={'cc_' + country.code + '_' + index} value={country.code}>{country.name}</option>;
                                    })}
                                </select>
                            </div>
                            <span className="dashed-place dashed-place--country col-xs-1">/</span>
                            <div className="col-xs-6 countrySelect__wrapper">
                                {states.length > 0 ? <select value={this.state.state} required  onChange={this.handleStateChange}>
                                    <option value="">Select Region</option>
                                    {states.map((state, index) => {
                                        return <option key={'sc_' + state.code + '_' + index} value={state.name}>{state.name}</option>
                                    })}
                                </select>
                                : <select disabled>
                                    <option value="">Not Available</option>
                                </select>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomAddress;
