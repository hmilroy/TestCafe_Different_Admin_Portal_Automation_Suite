import React from 'react';
import PropertyService from '../../../services/PropertiesServices';
import PropertyStore from '../../../stores/PropertyStore';
import PersonActions from '../../../actions/PersonActions';
import ViewPeopleForm from '../../../components/Forms/ViewPeople.jsx';
import PersonService from '../../../services/PersonService';
import _ from 'underscore';
import only from 'only';
import moment from 'moment';
import countries from '../../../../data/countries.json';
import AddPersonFrom from '../../../components/Forms/AddPersonForm.jsx'
import OptimalHash from '../../../../src/utility/optimus.js';
import {cloneObject} from '../../../../src/utility/helpers';
import ViewRoles from '../../../components/Forms/ViewRoles.jsx';
import Countries from '../../../../data/countries.json';
import BlockingAction from '../../../actions/BillsAction';

import Toastr from 'toastr';
import plusIcon from '../../../assets/images/plus.png';
import UiService from '../../../services/UiService';
import './people.scss';

function getSuggestions(query, country) {
    return PropertyService.propertySuggestionGlobal(query, country)
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


export default class People extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'owner',
            dataReceived: false,
            property: {},
            owners: null,
            person: {},
            editDisabled: true,
            address: '',
            countryCode: '+61',
            hasTenant: false,
            tenantSelected: false,
            emailChanged: false,
            hasStrata: null,
            hasProperty: null,
            loading: true,
            custom_address: '',
            isAusAddress: false,
            suggestions: [],
            valueSelect: '',
            propertyValue: {},
            suggestionSelected: false,
            update: false,
            addressCountry: '',
            addressCountryCode: '',
            addressChanged: false,
            addOwner: false,
            addTenant: false,
            addStrata: false,
            addProperty: false,
            tenants: null,
            multipleTenants: false,
            userSelected: false,
            company: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleMobileCountryChange = this.handleMobileCountryChange.bind(this);
        this.handleMobileNumberChange = this.handleMobileNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleMailChange = this.handleMailChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
        this.handleAddTenant = this.handleAddTenant.bind(this);
        this.handleAddStrata = this.handleAddStrata.bind(this);
        this.handleAddPropManager = this.handleAddPropManager.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCustomAddressChange = this.handleCustomAddressChange.bind(this);
        this.handleAusAddressChange = this.handleAusAddressChange.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.handleAddressCountryChange = this.handleAddressCountryChange.bind(this);
        this.handleResendEmailButtonClick = this.handleResendEmailButtonClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fetchPropertyDetails = this.fetchPropertyDetails.bind(this);
        this.handleAddOwnerClick = this.handleAddOwnerClick.bind(this);
        this.handleClickCancelAddOwner = this.handleClickCancelAddOwner.bind(this);
        this.ownerAdded = this.ownerAdded.bind(this);
        this.handleAddTenantClick = this.handleAddTenantClick.bind(this);
        this.handleUserSelected = this.handleUserSelected.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.fetchPerson = this.fetchPerson.bind(this);
        this.viewLease = this.viewLease.bind(this);
        this._mount = false;
    }

    handleAddressCountryChange(value) {
        let country = 'au';
        if (_.findWhere(countries, {'name': value})) {
            country = _.findWhere(countries, {'name': value}).code;
        }
        this.setState({
            addressCountry: value,
            addressCountryCode: country
        });
    }

    handleAddOwnerClick() {
        this.setState({
            addOwner: true
        });
    }

    handleClickCancelAddOwner() {
        this.setState({
            addOwner: false,
            addStrata: false,
            addProperty: false,
            addTenant: false
        });
    }

    ownerAdded() {
        this.fetchPropertyDetails();
        this.setState({
            addOwner: false,
            addStrata: false,
            addProperty: false,
            addTenant: false
        });
    }

    fetchPerson() {
        this.fetchPropertyDetails();
    }

    fetchPropertyDetails() {
        let self = this;
        let propertyId = OptimalHash.decode(this.props.params.id);
        // Retrieving Properties info
        return PropertyService.viewProperty(propertyId)
            .then(value => {
                if (self._mount) {
                    // Property Manager
                    let propertyManager = {};
                    if (!_.isUndefined(value.status.data.PropertyManagement) && !_.isNull(value.status.data.PropertyManagement)) {
                        propertyManager = value.status.data.PropertyManagement;
                    }

                    // Strata Manager
                    let strataManager = {};
                    if (!_.isUndefined(value.status.data.StrataManagement) && !_.isNull(value.status.data.StrataManagement)) {
                        strataManager = value.status.data.StrataManagement;
                    }

                    let activeLease = [];
                    if (value.status.data.Leases) {
                        activeLease = _.where(value.status.data.Leases, {status: 1});
                    }


                    this.setState({
                        property: value.status.data,
                        dataReceived: true,
                        suggestionSelected: false,
                        owners: value.status.data.PropertyOwnerships ? value.status.data.PropertyOwnerships : null,
                        tenants: activeLease,
                        strataManager,
                        propertyManager
                    }, function () {
                        let strataManagement = false;
                        let propertyManagement = false;

                        if (this.state.property.PropertyManagement) {
                            propertyManagement = true;
                        }

                        if (this.state.property.StrataManagement) {
                            strataManagement = true;
                        }
                        this.setState({
                            address: _.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                            hasStrata: strataManagement,
                            hasProperty: propertyManagement
                        });

                        let person = _.findWhere(this.state.property.PropertyOwnerships,
                            {primary_property_ownership_id: null}).PropertyOwner.User;
                        let countryCode = '+61';
                        if (person.tel_country_code &&
                            _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()})) {
                            countryCode = _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()}).dial_code;
                        }
                        if (person.tel_country_code) {
                            person.tel_country_code = person.tel_country_code.toLowerCase();
                        }

                        if (_.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_suburb
                            && _.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_post_code) {
                            this.setState({
                                isAusAddress: true,
                            })
                        } else {
                            this.setState({
                                custom_address: _.findWhere(this.state.property.PropertyOwnerships,
                                    {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                            })
                        }


                        let addressCountryCode = 'au';

                        if (_.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_country_code) {
                            addressCountryCode= _.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_country_code;
                        }

                        if (person.tel_number) {
                            person.tel_number = person.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                        }

                        this.setState({
                            countryCode: countryCode,
                            addressCountryCode: addressCountryCode,
                            valueSelect: _.findWhere(this.state.property.PropertyOwnerships,
                                {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                            person: person,
                            loading: false
                        });

                    });
                    this.handleChange(this.state.value);
                }
            })
            .catch(error=> {
                console.log(error);
            });
    }

    componentDidMount() {
        scroll(0, 0);
        this._mount = true;
        UiService.changePropertyTab({
            activeTab: 'People'
        });
        let self = this;
        this.fetchPropertyDetails()
            .then(function () {
                // Todo: handle proper tab selected
                if (!_.isUndefined(self.props.location.query.action) && self.props.location.query.action === 'addtenant' && self._mount) {
                    self.handleChange('tenant');
                    history.replaceState('','','#' + self.props.location.pathname);
                }
            });
    }

    componentWillUnmount() {
        this._mount = false;
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

    handleResendEmailButtonClick() {
        PersonService.resendSignupEmail(this.state.property.PropertyOwnership.PropertyOwner.User.id)
            .then((result) => {
                Toastr.success(result.status.message)
            })
            .catch(error => Toastr.error(error.error.status.message));
    }

    onSuggestionSelected(event, {suggestion}) {
        this.setState({
            valueSelect: suggestion.streetAddress,
            propertyValue: suggestion,
            suggestionSelected: true,
            addressChanged: true
        })
    }

    onSuggestionsFetchRequested({value}) {
        let country = 'au';
        if (this.state.value === 'owner') {
            country = this.state.addressCountryCode
        }
        getSuggestions(value, country)
            .then(dataSource => {
                this.setState({
                    suggestions: dataSource
                });
            });
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    handleChange(value) {
        this.setState({
            value: value,
            editDisabled: true,
            loading: true,
            update: true,
            addressChanged: false,
            addOwner: false,
            addTenant: false,
            addStrata: false,
            addProperty: false
        });
        let countryCode = '';
        let person = {};

        switch (value) {
            case "owner":
                countryCode = '+61';
                person = _.findWhere(this.state.property.PropertyOwnerships,
                    {primary_property_ownership_id: null}).PropertyOwner.User;
                if (person.tel_country_code && _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()})) {
                    countryCode = _.findWhere(countries,
                        {'code': person.tel_country_code.toUpperCase()}).dial_code;
                }
                if (person.tel_country_code) {
                    person.tel_country_code = person.tel_country_code.toLowerCase();
                }

                if (_.findWhere(this.state.property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner.addr_suburb
                    && _.findWhere(this.state.property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner.addr_post_code) {
                    this.setState({
                        isAusAddress: true,
                    })
                } else {
                    this.setState({
                        custom_address: _.findWhere(this.state.property.PropertyOwnerships,
                            {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                    })
                }

                if (person.tel_number) {
                    person.tel_number = person.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                }

                this.setState({
                    countryCode: countryCode,
                    loading: false,
                    person: person,
                    address: _.findWhere(this.state.property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                    valueSelect: _.findWhere(this.state.property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner.addr_street_address,
                    tenantSelected: false,
                });
                break;

            case "tenant":
                this.setState({
                    tenantSelected: true
                });
                if (this.state.property.Leases) {
                    countryCode = '+61';
                    // person = _.findWhere(this.state.property.Leases,
                    //     {primary_lease_id: null}).User;
                    // if (person.tel_country_code && _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()})) {
                    //     countryCode = _.findWhere(countries,
                    //         {'code': person.tel_country_code.toUpperCase()}).dial_code;
                    // }
                    // if (person.tel_country_code) {
                    //     person.tel_country_code = person.tel_country_code.toLowerCase();
                    // }
                    // if (person.tel_number) {
                    //     person.tel_number = person.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                    // }
                    // this.setState({
                    //     countryCode: countryCode,
                    //     loading: false,
                    //     person: person,
                    //     address: this.state.property.addr_street_address,
                    //     hasTenant: true
                    // });
                }
                break;

            case "strata_manager":
              this.setState({
                tenantSelected: false
              });
                countryCode = '+61';
                if (this.state.property.StrataManagement) {
                  person = this.state.property.StrataManagement.StrataManager.User;
                  if (person.tel_country_code && _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()})) {
                    countryCode = _.findWhere(countries,
                      {'code': person.tel_country_code.toUpperCase()}).dial_code;
                  }
                  if (person.tel_country_code) {
                    person.tel_country_code = person.tel_country_code.toLowerCase();
                  }
                  person.tel_number = person.mobile_number || person.tel_number;
                  if (person.tel_number) {
                    person.tel_number = person.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                  }
                  this.setState({
                    countryCode: countryCode,
                    loading: false,
                    person: person,
                    address: this.state.property.StrataManagement.StrataManager.addr_street_address,
                    valueSelect: this.state.property.StrataManagement.StrataManager.addr_street_address,
                    tenantSelected: false
                  });
                }
                break;

            case "property_manager":
                this.setState({
                    tenantSelected: false
                });
                countryCode = '+61';
                if (this.state.property.PropertyManagement) {
                  person = this.state.property.PropertyManagement.PropertyManager.User;
                  if (person.tel_country_code && _.findWhere(countries, {'code': person.tel_country_code.toUpperCase()})) {
                    countryCode = _.findWhere(countries,
                      {'code': person.tel_country_code.toUpperCase()}).dial_code;
                  }
                  if (person.tel_country_code) {
                    person.tel_country_code = person.tel_country_code.toLowerCase();
                  }
                  person.tel_number = person.mobile_number || person.tel_number;
                  if (person.tel_number) {
                    person.tel_number = person.tel_number.replace(/^0+/, '').replace(/[^0-9]/g, '');
                  }

                  this.setState({
                    countryCode: countryCode,
                    person: person,
                    loading: false,
                    company: this.state.property.PropertyManagement.PropertyManager.company,
                    address: this.state.property.PropertyManagement.PropertyManager.addr_street_address,
                    valueSelect: this.state.property.PropertyManagement.PropertyManager.addr_street_address,
                    tenantSelected: false
                  });
                }
                break;

            default :
                break;
        }
    };

    handleMobileCountryChange(e) {
        let country = 'au';
        if (_.findWhere(countries, {'dial_code': e})) {
            country = _.findWhere(countries, {'dial_code': e}).code;
        } else {
            country = 'au';
        }

        if (country === 'CA') {
            country = 'US';
        }
        let person = this.state.person;
        person.tel_country_code = country;

        this.setState({
            person: person,
            countryCode: e
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
            emailChanged: true
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
        this.setState({
            company: e.target.value
        });
    }

    handleNameChange(e) {
        let person = this.state.person;
        person.name = e.target.value;

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

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });
        let person = {};
        if (this.state.value === 'strata_manager') {
            person.id = this.state.property.StrataManagement.StrataManager.id;
        } else if (this.state.value === 'property_manager') {
            person.id = this.state.property.PropertyManagement.PropertyManager.id;
        } else {
          person.id = this.state.person.id;
        }
        person.name = this.state.person.name;
        if(this.state.person.tel_number){
            person.tel_number = this.state.person.tel_number;
            person.country_code = this.state.person.tel_country_code;
        }
        if (this.state.emailChanged) {
            person.email = this.state.person.email;
        }

        if (!this.state.addressCountryCode && this.state.value === 'owner') {
            person.custom_address = this.state.custom_address;
        } else if (this.state.propertyValue && this.state.propertyValue.streetAddress && this.state.value === 'owner') {

            switch (this.state.propertyValue.result_type) {
                case 'MAP':
                    person.local_place_info = only(_.clone(this.state.propertyValue),
                    'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber numberFirst ' +
                    'numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix ' +
                    'streetName streetType streetSuffixCode suburb state postCode location streetAddress');
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
        } else if (this.state.value != 'tenant' && this.state.value != 'owner' && this.state.addressChanged) {
            person.place_info = only(_.clone(this.state.propertyValue),
                'buildingName flatNumberPrefix flatNumber flatNumberSuffix levelNumber numberFirst ' +
                'numberFirstPrefix numberFirstSuffix numberLast numberLastPrefix numberLastSuffix ' +
                'streetName streetType streetSuffixCode suburb state postCode location streetAddress');
        }

        PersonService.updatePeople(person, this.state.value)
            .then(result => {
                this.setState({
                    suggestions: [],
                    valueSelect: '',
                    propertyValue: {},
                });
                this.fetchPropertyDetails();
                Toastr.success(result.status.message);
            })
            .catch(error => {
                Toastr.error(error.error.status.message)
            });
    }

    handleAddTenant(e) {
        e.preventDefault();
        PersonActions.addTenant(PropertyStore.propertyId);
        this.props.router.push('add-person');
    }

    viewLease() {
        this.props.router.push('view-property/'+OptimalHash.encode(PropertyStore.propertyId)+'/payment');
    }

    handleClearForm(e) {
      this.setState({
          editDisabled : true,
      });
      this.handleChange(this.state.value);
    }

    handleAddTenantClick() {
        this.setState({
            addTenant: true
        });
    }

    handleAddStrata(e) {
      this.setState({
        addStrata: true
      });
    }

    handleUserSelected(value) {
        this.setState({
            userSelected: value
        });
    }

    handleAddPropManager(e) {
      this.setState({
        addProperty: true
      });
    }

    onChange(event, {newValue, method}) {
        this.setState({
            valueSelect: newValue
        });
    }

    render() {
        const {valueSelect, suggestions} = this.state;
        const inputProps = {
            placeholder: "Search",
            value: valueSelect || '',
            onChange: this.onChange
        };

        // Property Manager View
        let propertyManagerView = null;
        if (this.state.hasProperty && !_.isNull(this.state.propertyManager)) {
            let propertyManager = this.state.propertyManager;
            let user = propertyManager.PropertyManager.User;
            let userInfo = propertyManager.PropertyManager;

            let phoneCountry = Countries.filter(country=> {
                return country.code.toLowerCase() === (user.tel_country_code ? user.tel_country_code.toLowerCase() : 'au');
            });
            let countryCode = phoneCountry.length ? phoneCountry[0].dial_code : '+61';

            propertyManagerView = <ViewRoles
                isSignedUp={user.is_signedup === 0}
                userId={OptimalHash.encode(userInfo.id)}
                propertyId={this.props.params.id}
                mailingAddress={userInfo.addr_street_address}
                headless={true}
                className="person-role-form"
                handleParentUpdate={this.fetchPerson}
                makeParentEditable={this.makeEditable}
                makeParentNonEditable={this.makeNonEditable}
                updateParentPhone={this.handlePhoneChange}
                hasResend={user.is_signedup === 0}
                type={'property_manager'}
                person={user}
                email={user.email}
                name={user.name}
                phone={user.tel_number}
                phone_country={user.tel_country_code}
                countryCode={countryCode}
                edit={false || this.state.edit}
                address={this.state.phone_country}
                userInfo={userInfo}
            />
        }

        // Strata Manager View
        let strataManagerView = null;
        if (this.state.hasStrata && !_.isNull(this.state.strataManager)) {
            let strataManager = this.state.strataManager;
            let user = strataManager.StrataManager.User;
            let userInfo = strataManager.StrataManager;

            let phoneCountry = Countries.filter(country=> {
                return country.code.toLowerCase() === (user.tel_country_code ? user.tel_country_code.toLowerCase() : 'au');
            });
            let countryCode = phoneCountry.length ? phoneCountry[0].dial_code : '+61';

            strataManagerView = <ViewRoles
            isSignedUp={user.is_signedup === 0}
            userId={OptimalHash.encode(userInfo.id)}
            propertyId={this.props.params.id}
            mailingAddress={userInfo.addr_street_address}
            headless={true}
            className="person-role-form"
            handleParentUpdate={this.fetchPerson}
            makeParentEditable={this.makeEditable}
            makeParentNonEditable={this.makeNonEditable}
            updateParentPhone={this.handlePhoneChange}
            hasResend={user.is_signedup === 0}
            type={'strata_manager'}
            person={user}
            email={user.email}
            name={user.name}
            phone={user.tel_number}
            phone_country={user.tel_country_code}
            countryCode={countryCode}
            edit={false || this.state.edit}
            address={this.state.phone_country}
            userInfo={userInfo}
                />
        }
        const owners = this.state.owners &&  this.state.owners.map((owner, index) => {

            let user = cloneObject(owner.PropertyOwner.User);
            let userInfo = owner.PropertyOwner;

            let phoneCountry = Countries.filter(country=> {
                return country.code.toLowerCase() === (user.tel_country_code ? user.tel_country_code.toLowerCase() : 'au');
            });
            let countryCode = phoneCountry.length ? phoneCountry[0].dial_code : '+61';
            return(
                <ViewRoles
                    isSignedUp={user.is_signedup === 0}
                    userId={OptimalHash.encode(user.id)}
                    key={OptimalHash.encode(user.id) + '_' + index}
                    propertyId={this.props.params.id}
                    mailingAddress={userInfo.addr_street_address}
                    headless={true}
                    className="person-role-form"
                    handleParentUpdate={this.fetchPerson}
                    makeParentEditable={this.makeEditable}
                    makeParentNonEditable={this.makeNonEditable}
                    updateParentPhone={this.handlePhoneChange}
                    hasResend={user.is_signedup === 0}
                    type={'owner'}
                    person={user}
                    email={user.email}
                    name={user.name}
                    phone={user.tel_number}
                    phone_country={user.tel_country_code}
                    countryCode={countryCode}
                    edit={false || this.state.edit}
                    address={this.state.phone_country}
                    userInfo={userInfo}
                />
            );
        });
        // show only the first tenant when multiple tenants are disabled ( for dev purpose )
        let multiTenants = this.state.tenants && (this.state.multipleTenants ? this.state.tenants : this.state.tenants.slice(0,1));
        const tenants = multiTenants && multiTenants.map((tenant, index)=> {
            let user = tenant.User;
            let leaseText = tenant.lease_type === 1 ? 'Periodic' : 'Fixed ' + moment(tenant.lease_start_date).format('DD/MM/YYYY')
                + ' - ' + moment(tenant.lease_end_date).format('DD/MM/YYYY');
            if(!_.isNull(user) && !_.isUndefined(user)) {
                let userInfo = tenant;

                let phoneCountry = Countries.filter(country => {
                    return country.code.toLowerCase() === (user.tel_country_code ? user.tel_country_code.toLowerCase() : 'au');
                });
                let countryCode = phoneCountry.length ? phoneCountry[0].dial_code : '+61';
                return (
                    <ViewRoles
                        key={OptimalHash.encode(user.id)}
                        propertyId={this.props.params.id}
                        mailingAddress={userInfo.addr_street_address}
                        headless={true}
                        className="person-role-form"
                        handleParentUpdate={this.fetchPerson}
                        makeParentEditable={this.makeEditable}
                        makeParentNonEditable={this.makeNonEditable}
                        updateParentPhone={this.handlePhoneChange}
                        type={'tenant'}
                        person={user}
                        email={user.email}
                        name={user.name}
                        phone={user.tel_number}
                        phone_country={user.tel_country_code}
                        countryCode={countryCode}
                        edit={false || this.state.edit}
                        address={this.state.phone_country}
                        leaseText={leaseText}
                    />
                );
            }
        });

        return (
            <div className="admin-padding-adjustment add-person-form people-tab people-tab-gray">
                <div className="section-header form-header align-left">
                    <h1>{this.state.property.addr_street_address} <i className="oval"/> <span className="document">People</span></h1>
                </div>
                <div className="row col-xs-12 person-role-tabs">
                    <div className={this.state.value == "owner" ? 'active-tab tab' : 'tab'}
                         onClick={() => this.handleChange("owner")}>
                        OWNER
                    </div>
                    <div className={this.state.value == "tenant" ? 'active-tab tab' : 'tab'}
                         onClick={() => this.handleChange("tenant")}>
                        TENANT
                    </div>
                    {this.state.property.strata_managed ?
                        (<div className={this.state.value == "strata_manager" ? 'active-tab tab' : 'tab'}
                              onClick={() => this.handleChange("strata_manager")}>
                            STRATA MANAGER
                        </div>) : <div></div>}
                    {this.state.property.previous_property_manager ?
                        (<div className={this.state.value == "property_manager" ? 'active-tab tab' : 'tab'}
                              onClick={() => this.handleChange("property_manager")}>
                            PROPERTY MANAGER
                        </div>) : <div></div>}
                </div>
              {(!this.state.hasStrata && this.state.property.strata_managed &&
              this.state.value === 'strata_manager') ? (<div className="row end-xs">
                    <div>
                        <div onClick={this.handleAddStrata} className="text_button">
                            <ul>
                                <li>
                                    <img src={plusIcon} alt="" />
                                </li>
                                <li>
                                    Add Strata Manager
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>) : (<div></div>)}
              {(!this.state.hasProperty && this.state.property.previous_property_manager &&
              this.state.value === 'property_manager') ? (<div className="row end-xs">
                    <div>
                        <div onClick={this.handleAddPropManager} className="text_button">
                            <ul>
                                <li>
                                    <img src={plusIcon} alt="" />
                                </li>
                                <li>
                                    Add Property Manager
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>) : (<div></div>)}
                {!this.state.loading && this.state.value === 'owner' && <div className="row end-xs">
                    <div>
                        <div onClick={this.handleAddOwnerClick} className="text_button">
                                <ul>
                                    <li>
                                        <img src={plusIcon} alt="" />
                                    </li>
                                    <li>
                                        Add Owner
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>}
                {this.state.tenantSelected && !this.state.hasTenant &&
                this.state.tenants.length > 0 && _.isNull(this.state.tenants[0].User)  &&
                this.state.value === 'tenant' &&
                <div className="row end-xs">
                        <div>
                            <div onClick={this.handleAddTenantClick} className="text_button">
                                <ul>
                                    <li>
                                        <img src={plusIcon} alt="" />
                                    </li>
                                    <li>
                                        Add Tenant
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>}
                    {this.state.addOwner &&
                    <div>
                    <AddPersonFrom headless={true} notifyHeadlessParent={this.handleUserSelected} handleNotifyParent={this.ownerAdded} type="Owner" propertyId={this.props.params.id}/>
                    {!this.state.userSelected &&
                    <div className="row">
                        <div className="col-xs-8 col-xs-offset-3 cancel-button">
                        <button className="button" onClick={this.handleClickCancelAddOwner}>Cancel</button>
                        </div>
                    </div>
                    }
                    </div>}
                {this.state.addTenant &&
                    <div>
                    <AddPersonFrom headless={true} Leases={this.state.property.Leases} notifyHeadlessParent={this.handleUserSelected} handleNotifyParent={this.ownerAdded} type="Tenant" propertyId={this.props.params.id} />
                       {!this.state.userSelected &&
                        <div className="row">
                            <div className="col-xs-8 col-xs-offset-3 cancel-button">
                                <button className="button" onClick={this.handleClickCancelAddOwner}>Cancel</button>
                            </div>
                        </div>
                        }
                    </div>}
                {this.state.tenantSelected && !this.state.hasTenant && this.state.tenants.length === 0 &&
                <div className="leases-section">
                    <div className="leases-header-section"> There is no lease on this property</div>
                    <div className="wide-left-space status-sub-header-text">Please <a className="add-lease-link" onClick={this.viewLease}>ADD LEASE</a> to add a tenant</div>
                </div>}
                {this.state.tenantSelected && <div className="top-margin">
                    {tenants}
                    </div>}
                { !this.state.loading &&
                (this.state.tenantSelected && this.state.hasTenant) &&
                (<ViewPeopleForm
                    person={this.state.person}
                    address={this.state.address}
                    addressCountry={this.state.addressCountry}
                    addressCountryCode={this.state.addressCountryCode}
                    onAddressCountryChange={this.handleAddressCountryChange}
                    customAddress={this.state.custom_address}
                    userType={this.state.value}
                    editDisabled={this.state.editDisabled}
                    countryCode={this.state.countryCode}
                    handleEditClick={this.handleEditClick}
                    onMobileCountryChange={this.handleMobileCountryChange}
                    onMobileNumberChange={this.handleMobileNumberChange}
                    onEmailChange={this.handleEmailChange}
                    onMailChange={this.handleMailChange}
                    onSubmit={this.handleFormSubmit}
                    onCompanyChange={this.handleCompanyChange}
                    onNameChange={this.handleNameChange}
                    onWebsiteChange={this.handleWebsiteChange}
                    onCustomAddressChange={this.handleCustomAddressChange}
                    ausAddress={this.state.isAusAddress}
                    onAusAddressChange={this.handleAusAddressChange}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSectionSuggestions={getSectionSuggestions}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected}/>)}
                { !this.state.loading && this.state.value === 'owner' &&
                (
                <div className="top-margin">
                    {owners}
                    </div>
                    )}
                { !this.state.loading && this.state.value === 'property_manager' &&
                <div className="top-margin">
                    {propertyManagerView}
                </div>}
                { !this.state.loading && this.state.value === 'strata_manager' && <div className="top-margin">
                        {strataManagerView}
                </div>}

                  {this.state.addStrata &&
                  <div>
                      <AddPersonFrom headless={true} notifyHeadlessParent={this.handleUserSelected} handleNotifyParent={this.ownerAdded} type="Strata Manager" propertyId={this.props.params.id}/>
                    {!this.state.userSelected &&
                    (<div className="row">
                        <div className="col-xs-8 col-xs-offset-3 cancel-button">
                            <button className="button" onClick={this.handleClickCancelAddOwner}>Cancel</button>
                        </div>
                    </div>)
                    }
                  </div>}

                  {this.state.addProperty &&
                  (<div>
                      <AddPersonFrom headless={true} notifyHeadlessParent={this.handleUserSelected} handleNotifyParent={this.ownerAdded} type="Property Manager" propertyId={this.props.params.id}/>
                    {!this.state.userSelected &&
                    <div className="row">
                        <div className="col-xs-8 col-xs-offset-3 cancel-button">
                            <button className="button" onClick={this.handleClickCancelAddOwner}>Cancel</button>
                        </div>
                    </div>
                    }
                  </div>)}

            </div>
        );
    }
}
