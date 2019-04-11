import React from 'react';

import PersonService from '../../services/PersonService';
import PropertiesService from '../../services/PropertiesServices';
import ViewPersonForm from '../../components/Forms/ViewPerson.jsx';
import Toastr from 'toastr';
import PropertyActions from '../../actions/ProepertyActions';
import LoginAction from '../../actions/LoginActions';
import OptimalHash from '../../utility/optimus.js';
import _ from 'underscore';
import Countries from '../../../data/countries.json';

function getSuggestions(query, country) {
    return PropertiesService.propertySuggestionGlobal(query, country)
        .then(value => {
            return value;
        })
        .then(retrievedSearchTerms => {
            return retrievedSearchTerms.data.address_result;
        });
}

function getSectionSuggestions(section) {
    return section;
}

export default class ViewPerson extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataReceived: false,
            editDisabled: true,
            person: {},
            type: '',
            address: '',
            propertyAddress: '',
            propertyId: '',
            countryCode: '+61',
            suggestions: [],
            value: '',
            propertyValue: {},
            mailChanged: false,
            isAusAddress: false,
            custom_address: '',
            addressCountry: '',
            addressCountryCode: ''

        };
        PersonService.viewPerson(this.props.params.id, this.props.params.type);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleMobileCountryChange = this.handleMobileCountryChange.bind(this);
        this.handleMobileNumberChange = this.handleMobileNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleMailChange = this.handleMailChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
        this.handleViewProperty = this.handleViewProperty.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fetchPerson = this.fetchPerson.bind(this);
        this.handleAusAddressChange = this.handleAusAddressChange.bind(this);
        this.handleAddressCountryChange = this.handleAddressCountryChange.bind(this);
        this.handleCustomAddressChange = this.handleCustomAddressChange.bind(this);
        this.handleResendEmailButtonClick = this.handleResendEmailButtonClick.bind(this);
        this.handleAddressCountryFlagChange = this.handleAddressCountryFlagChange.bind(this);
    }

    componentDidMount() {
        this.fetchPerson();
    }

    handleCustomAddressChange(e) {
        this.setState({
            custom_address: e.target.value
        })
    }

    handleAusAddressChange(e) {
        this.setState({
            isAusAddress: e.target.checked
        })
    }

    fetchPerson() {
        // Retrieving Person's info
        PersonService.findOne(OptimalHash.decode(this.props.params.id), this.props.params.type)
            .then(value => {
                let formattedAddress = '';
                let propertyAddress = '';
                let propertyId = '';
                let countryCode = '+61';

                if (value.data.PropertyOwner && this.props.params.type == 'owner') {
                    if (value.data.PropertyOwner) {
                        formattedAddress = value.data.PropertyOwner.addr_street_address;
                    } else {
                        formattedAddress = value.data.addr_street_address;
                    }
                    propertyAddress = value.data.PropertyOwner.PropertyOwnerships[0].Property.addr_street_address;
                    propertyId = value.data.PropertyOwner.PropertyOwnerships[0].Property.id;
                    if (value.data.tel_country_code) {
                        countryCode = _.findWhere(Countries,
                            {'code': value.data.tel_country_code.toUpperCase()}).dial_code;
                    }
                    if (value.data.PropertyOwner.addr_suburb && value.data.PropertyOwner.addr_post_code) {
                        this.setState({
                            isAusAddress: true,
                        })
                    } else {
                        this.setState({
                            custom_address: formattedAddress
                        })
                    }

                    if (value.data.PropertyOwner.addr_country_code) {
                        this.setState({
                            addressCountryCode: _.findWhere(Countries,
                                {'code': value.data.PropertyOwner.addr_country_code}).dial_code,
                            addressCountry: value.data.PropertyOwner.addr_country_code
                        })
                    } else {
                        this.setState({
                            addressCountryCode: '+61',
                            addressCountry: 'au'
                        })
                    }

                } else if (value.data.PropertyTenancies && this.props.params.type == 'tenant') {
                    let tenant = _.findWhere(value.data.PropertyTenancies, {primary_property_tenancy_id: null});
                    propertyAddress = tenant.Property.addr_street_address;
                    propertyId = tenant.Property.id;
                    if (value.data.tel_country_code === 'lk' || value.data.tel_country_code === 'LK') {
                        countryCode = '+94';
                    }
                } else {
                    switch (this.props.params.type) {
                        case 'strata_manager':
                            propertyAddress = value.data.StrataManagements[0].Property.addr_street_address;
                            propertyId = value.data.StrataManagements[0].Property.id;
                            if (value.data.tel_country_code) {
                                countryCode = _.findWhere(Countries,
                                    {'code': value.data.tel_country_code.toUpperCase()}).dial_code;
                            }
                            break;
                        case 'property_manager':
                            propertyAddress = value.data.PropertyManagements[0].Property.addr_street_address;
                            propertyId = value.data.PropertyManagements[0].Property.id;
                            if (value.data.tel_country_code) {
                                countryCode = _.findWhere(Countries,
                                    {'code': value.data.tel_country_code.toUpperCase()}).dial_code;
                            }
                            break;
                        case 'inspector':
                            propertyAddress = value.data.PropertyInspections[0].Property.addr_street_address;
                            propertyId = value.data.PropertyInspections[0].Property.id;
                            if (value.data.tel_country_code) {
                                countryCode = _.findWhere(Countries,
                                    {'code': value.data.tel_country_code.toUpperCase()}).dial_code;
                            }
                            break;
                    }
                }
                let person = value.data;
                if(value.data.tel_number) {
                    person.tel_number = value.data.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                }

                this.setState({
                    person: person,
                    type: this.props.params.type,
                    dataReceived: true,
                    address: formattedAddress,
                    value: formattedAddress,
                    propertyAddress: propertyAddress,
                    propertyId: OptimalHash.encode(Number(propertyId)),
                    countryCode: countryCode
                });
            })
            .catch(LoginAction.logoutUser)
    }

    onChange(event, {newValue, method}) {
        this.setState({
            value: newValue
        });
    }

    onSuggestionSelected(event, {suggestion}) {
        this.setState({
            value: suggestion.streetAddress,
            propertyValue: suggestion
        })
    }

    onSuggestionsFetchRequested({value}) {
        getSuggestions(value, this.state.addressCountry)
            .then(dataSource => {
                this.setState({
                    suggestions: dataSource
                });
            });
    }

    handleAddressCountryChange(value) {
        let country = '+61';
        if (_.findWhere(Countries, {'name': value})) {
            country = _.findWhere(Countries, {'name': value}).code;
        }
        this.setState({
            addressCountry: value,
            addressCountryCode: country
        });
    }

    handleAddressCountryFlagChange(code) {
        let country = '+61';
        if (_.findWhere(Countries, {'dial_code': code})) {
            country = _.findWhere(Countries, {'dial_code': code}).code;
        }
        if (code === '+1') {
            country = 'US'
        }
        this.setState({
            addressCountry: country,
            addressCountryCode: code
        });
    }

    handleResendEmailButtonClick() {
        PersonService.resendSignupEmail(OptimalHash.decode(this.props.params.id))
            .then((result) => {
                Toastr.success(result.status.message)
            })
            .catch(error => Toastr.error(error.error.status.message));
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    handleMobileCountryChange(code) {
        let country = 'au';
        if (_.findWhere(Countries, {'dial_code': code})) {
            country = _.findWhere(Countries, {'dial_code': code}).code;
        }
        if (country === 'CA') {
            country = 'US';
        }
        let person = this.state.person;
        person.tel_country_code = country;

        this.setState({
            person: person,
            countryCode: code
        });
    }

    handleMobileNumberChange(e) {
        let person = this.state.person;
        person.tel_number = e.target.value.replace(/^0+/, '').replace(/[^0-9]/g, '');

        if(!person.tel_country_code) {
            person.tel_country_code = 'au';
        }

        this.setState({
            person: person
        });
    }

    handleEmailChange(e) {
        let person = this.state.person;
        person.email = e.target.value;

        this.setState({
            person: person,
            mailChanged: true
        });
    }

    handleMailChange(e) {
        let person = this.state.person;
        person.address = e.target.value;

        this.setState({
            person: person
        });
    }

    handleCompanyChange(e) {
        let person = this.state.person;
        person.company = e.target.value;

        this.setState({
            person: person
        });
    }

    handleWebsiteChange(e) {
        let person = this.state.person;
        person.website = e.target.value;

        this.setState({
            person: person
        });
    }

    handleEditClick() {
        this.setState({
            editDisabled: false
        })
    }

    handleViewProperty(e) {
        PropertyActions.viewProperty(this.state.propertyId);
        this.props.router.push('view-property/' + this.state.propertyId);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });

        let person = {};
        person.id = OptimalHash.decode(this.props.params.id);

        switch (this.props.params.type) {
            case 'owner':
                if (this.state.mailChanged) {
                    person.email = this.state.person.email;
                }
                if (this.state.person.tel_number) {
                    person.tel_number = this.state.person.tel_number;
                    person.country_code = this.state.person.tel_country_code;
                }
                if (!this.state.addressCountryCode) {
                    person.custom_address = this.state.custom_address;
                } else if (this.state.propertyValue && this.state.propertyValue.streetAddress) {

                    switch (this.state.propertyValue.result_type) {
                        case 'MAP':
                            person.local_place_info = _.clone(this.state.propertyValue);
                            delete person.local_place_info.result_type;
                            break;
                        case 'SMT':
                            person.us_place_info = _.clone(this.state.propertyValue);
                            delete person.us_place_info.result_type;
                            break;
                        case 'CRF':
                            person.other_place_id = this.state.propertyValue.placeId;
                            person.address_country_code = this.state.propertyValue.countryCode;
                            break;
                        case 'GOG':
                            person.google_place_id = this.state.propertyValue.placeId;
                            break;
                    }
                }
                break;
            case 'tenant':
                if (this.state.mailChanged) {
                    person.email = this.state.person.email;
                }
                if (this.state.person.tel_number) {
                    person.tel_number = this.state.person.tel_number;
                    person.country_code = this.state.person.tel_country_code;
                }
                break;
            case 'strata_manager':

                break;
            case 'property_manager':

                break;
            case 'inspector':

                break;
        }
        PersonService.updatePerson(person)
            .then(result => {
                this.fetchPerson();
                Toastr.success(result.status.message)
            })
            .catch(error => Toastr.error(error.error.status.message));
    }

    get viewPort() {
        if (!this.state.dataReceived) {
            return (
                <div>
                    <h1>
                        {/*ToDo: Proper data loading handling*/}
                    </h1>
                </div>
            )
        } else {
            const {value, suggestions} = this.state;
            const inputProps = {
                placeholder: "Search",
                value: value || '',
                onChange: this.onChange
            };
            return (
                <div>
                    <ViewPersonForm
                        person={this.state.person}
                        type={this.state.type}
                        address={this.state.address || ''}
                        ausAddress={this.state.isAusAddress}
                        addressCountry={this.state.addressCountry}
                        addressCountryCode={this.state.addressCountryCode}
                        customAddress={this.state.custom_address}
                        countryCode={this.state.countryCode || ''}
                        propertyAddress={this.state.propertyAddress}
                        propertyId={this.state.propertyId}
                        editDisabled={this.state.editDisabled}
                        handleEditClick={this.handleEditClick}
                        onMobileCountryChange={this.handleMobileCountryChange}
                        onMobileNumberChange={this.handleMobileNumberChange}
                        onEmailChange={this.handleEmailChange}
                        onMailChange={this.handleMailChange}
                        onSubmit={this.handleFormSubmit}
                        onCompanyChange={this.handleCompanyChange}
                        onWebsiteChange={this.handleWebsiteChange}
                        onPropertyClick={this.handleViewProperty}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSectionSuggestions={getSectionSuggestions}
                        inputProps={inputProps}
                        onSuggestionSelected={this.onSuggestionSelected}
                        onAusAddressChange={this.handleAusAddressChange}
                        onCustomAddressChange={this.handleCustomAddressChange}
                        onAddressCountryChange={this.handleAddressCountryChange}
                        onResendClick={this.handleResendEmailButtonClick}
                        onAddressCountryFlagChange={this.handleAddressCountryFlagChange}
                    />
                </div>
            )
        }
    }

    render() {
        return (this.viewPort);
    }
}