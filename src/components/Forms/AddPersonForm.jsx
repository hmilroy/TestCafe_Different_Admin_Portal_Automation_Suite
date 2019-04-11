import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import SearchService from '../../services/SearchServices.js';
import UserService from '../../services/UserService.js';
import PropertiesService from '../../services/PropertiesServices';
import Person from '../../services/PersonService';
import PersonStore from '../../stores/PersonStore';
import PropertyStore from '../../stores/PropertyStore';
import AutoSuggest from 'react-autosuggest';
import OptimalHash from '../../utility/optimus.js';
import CustomAddress from '../elements/CustomAddress.jsx';
import ReactPhoneInput from 'react-phone-input';
import only from 'only';
import moment from 'moment';
import EditablePhoneInput from '../elements/EditablePhoneInput.jsx';

import SearchInput from '../elements/SearchInput.jsx';
import Select from '../elements/Select.jsx';
import SingleInput from '../elements/SingleInput.jsx';
import plusImage from '../../assets/images/plus.png';
import Countries from '../../../data/countries.json';
import PhoneInput from '../elements/PhoneNumber.jsx';
import WebInput from '../elements/WebInput.jsx';
import CategorySelect from '../elements/CategorySelect.jsx';
import plusIcon from '../../assets/images/plus.png';
import cancelIcon from '../../assets/images/cancel.png';
import Blocker from '../../actions/BlockingActions.js';

const SelectionTypes = [
  {
    "id": 4,
    "name": "Tradie"
  },
  {
    "id": 7,
    "name": "Inspector"
  }
];

function getSuggestions(query) {
    return PropertiesService.propertySuggestion(query)
        .then(value => {
            return value;
        })
        .then(retrievedSearchTerms => {
            return retrievedSearchTerms.data.mappify_result;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.streetAddress}</span>
    );
}

function getSectionSuggestions(section) {
    return section;
}

const renderInputComponent = inputProps => (
    <input { ...inputProps} />
);

class AddPersonForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            company: '',
            country: 'au',
            edit: true,
            email: '',
            emailSource: [],
            emailSourceObject: [],
            emailValidation: true,
            emailValidationMessage: '',
            propertyId: props.propertyId ? props.propertyId : null,
            formatedType: 'tradie',
            initialStage: false,
            mailingAddressValue: props.mailingAddress ? props.mailingAddress : '',
            name: '',
            otherCategory: '',
            phone: '',
            property: '',
            propertySource: [],
            propertySourceObjects: [],
            suggestions: [],
            selectedCategory: '',
            type: [],
            typeSelection: props.type ? props.type : 'Tradie',
            tradieCategory: [],
            website: '',
            customAddressValue: {},
            headless: this.props.headless ? this.props.headless : false,
            hasCustomMailingAddress: false,
            customAddressEnabled: true
        };
        this.handleNewEmail = this.handleNewEmail.bind(this);
        this.handleUpdateEmail = this.handleUpdateEmail.bind(this);
        this.searchEmail = this.searchEmail.bind(this);
        this.handleTypeSelect = this.handleTypeSelect.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.renderOtherInputs = this.renderOtherInputs.bind(this);
        this.handleCountryCodeChange = this.handleCountryCodeChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.onUpdatePropertyInput = this.onUpdatePropertyInput.bind(this);
        this.onNewPropertyInputRequest = this.onNewPropertyInputRequest.bind(this);
        this.searchProperty = this.searchProperty.bind(this);
        this.onMailingAddressSuggestionsFetchRequested = this.onMailingAddressSuggestionsFetchRequested.bind(this);
        this.onMailingAddressSuggestionsClearRequested = this.onMailingAddressSuggestionsClearRequested.bind(this);
        this.onMailingAddressSuggestionSelected = this.onMailingAddressSuggestionSelected.bind(this);
        this.handleMailingAddressInputChange = this.handleMailingAddressInputChange.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleOtherCategory = this.handleOtherCategory.bind(this);
        this.handleNotFoundEmail = this.handleNotFoundEmail.bind(this);
        this.renderEmailInput = this.renderEmailInput.bind(this);
        this.handleExistingEmail = this.handleExistingEmail.bind(this);
        this.fetchPerson = this.fetchPerson.bind(this);
        this.handleNewCustomAddress = this.handleNewCustomAddress.bind(this);
        this.handleDeActivateCustomMailingAddress = this.handleDeActivateCustomMailingAddress.bind(this);
        this.handleActivateCustomMailingAddress = this.handleActivateCustomMailingAddress.bind(this);
    }


    handleActivateCustomMailingAddress() {
        this.setState({
            hasCustomMailingAddress: true
        });
    }

    handleNewCustomAddress(data) {
        this.setState({
            customAddressValue: data
        });
    }

    handleDeActivateCustomMailingAddress() {
        this.setState({
            hasCustomMailingAddress: false,
            customAddressValue: null
        });
    }

    handleCategorySelect(e) {
        this.setState({
            selectedCategory: e.target.value
        });
    }

    handleOtherCategory(e) {
        this.setState({
            otherCategory: e.target.value
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if(!this.state.initialStage) { // prevent form submittion before email is accepted
            return;
        }
        let userType = _.findWhere(this.state.type, { 'name': this.state.typeSelection }).id;
        let userTypeName = _.findWhere(this.state.type, { 'name': this.state.typeSelection }).name;
        switch (userTypeName) {
            case "Owner":
                userTypeName = 'owner';
                break;
            case "Tenant":
                userTypeName = 'tenant';
                break;
            case "Strata Manager":
                userTypeName = 'strata_manager';
                break;
            case "Property Manager":
                userTypeName = 'property_manager';
                break;
            case "Inspector":
                userTypeName = 'inspector';
                break;
            case "Tradie":
                userTypeName = 'tradie';
                break;
            default:
                break;
        }

        let id = this.state.propertySourceObjects.filter(item => {
            return item.address === this.state.property;
        });
        let propertyId = this.state.property
            ? _.findWhere(this.state.propertySourceObjects, { 'address': this.state.property }).id
            : '';
        let leaseId = _.first(_.where(PropertyStore.data.status.data.Leases, {status: 1})).id;
        let tradieCategoryId = this.state.selectedCategory
            ? _.findWhere(this.state.tradieCategory, { 'name': this.state.selectedCategory }).id
            : '';

        if (this.state.mailingAddressValue && this.props.type === 'owner') {
            person.local_place_info = this.state.propertyValue;
        } else if (this.state.mailingAddressValue) {
            let person = {};
            person.place_info = this.state.propertyValue;
        }
        propertyId = this.props.propertyId ? this.props.propertyId : propertyId;

        if(this.state.headless) {
            let user = {
                email: this.state.email,
                name: this.state.name,
                country_code: this.state.country,
                tel_number: this.state.phone,
                user_type: "2",
                property_id: OptimalHash.decode(this.props.propertyId),
                lease_id: leaseId
            };
            switch(this.props.type) {
                case 'Owner':
                    user.user_type = 2;
                    break;
                case 'Tenant':
                    user.user_type = 3;
                    break;
                  case 'Strata Manager':
                    user.user_type = 5;
                    break;
                  case 'Property Manager':
                    user.user_type = 6;
                    break;
            }
            if (this.props.type === 'Owner' || this.props.type === 'Tenant') {
              Person.addOwner(user)
                .then(result=> {
                  Toastr.success(result.status.message);
                  this.props.handleNotifyParent();
                })
                .catch(error=> {
                  if(error.error) {
                    Toastr.error(error.error.status.message);
                  } else {
                    console.log(error);
                  }
                });
            } else {
                let person = {
                    email: this.state.email,
                    name: this.state.name,
                    user_type: userType,
                    country_code: this.state.country,
                    tel_number: this.state.phone,
                    property_id: OptimalHash.decode(propertyId),
                    place_info_arg: this.state.propertyValue,
                    company_name: this.state.company,
                    website_url: this.state.website,
                    tradie_category_name: this.state.otherCategory,
                    tradie_category_id: tradieCategoryId
                };
                if (this.state.hasCustomMailingAddress == true && !_.isEmpty(this.state.customAddressValue)) {
                    person.custom_address = this.state.customAddressValue;
                    person = only(person, 'id email tradie_category_id user_type tradie_category_name name property_id website_url tel_number company_name country_code custom_address country');
                }
              // Person.addPerson(user.email, user.name, user.user_type, user.country_code, user.tel_number, user.property_id,
              //   this.state.propertyValue, this.state.company, this.state.website, this.state.otherCategory, tradieCategoryId)
                Person.addPersonManualAddress(person)
                .then(result=> {
                  Toastr.success(result.status.message);
                  this.props.handleNotifyParent();
                })
                .catch(error=> {
                  if(error.error) {
                    Toastr.error(error.error.status.message);
                  } else {
                    console.log(error);
                  }
                });
            }
          return;
        }
        Blocker.block();
        let person = {
            email: this.state.email,
            name: this.state.name,
            user_type: userType,
            country_code: this.state.country,
            tel_number: this.state.phone,
            property_id: propertyId,
            place_info_arg: this.state.propertyValue,
            company_name: this.state.company,
            website_url: this.state.website,
            tradie_category_name: this.state.otherCategory,
            tradie_category_id: tradieCategoryId
        };
        if (this.state.hasCustomMailingAddress == true && !_.isEmpty(this.state.customAddressValue)) {
            person.custom_address = this.state.customAddressValue;
            person = only(person, 'id email tradie_category_id user_type tradie_category_name name property_id website_url tel_number company_name country_code custom_address country');
        }

        // Person.addPerson(this.state.email, this.state.name, userType, this.state.country, this.state.phone, propertyId,
        // this.state.propertyValue, this.state.company, this.state.website, this.state.otherCategory, tradieCategoryId)
        Person.addPersonManualAddress(person)
        .then(result=> {
            Toastr.success(result.status.message);
            //This handle different user types
                let userId = result.data.userId;
                window.location.href = '/#/view-person/' + OptimalHash.encode(userId) + '/' + userTypeName;
                Person.notAddingRole();
                Person.viewPerson(userId, userTypeName);

        })
        .catch(error=> {
            Toastr.error(error.error.status.message);
        })
        .then(()=> {
            Blocker.unblock();
        })
    }

    handleWebsiteChange(e){
        this.setState({
            website: e.target.value
        });
    }

    handleCompanyChange(e) {
        this.setState({
            company: e.target.value
        });
    }
    onUpdatePropertyInput(inputValue) {
        this.setState({
            property: inputValue
        }, function(){
            this.searchProperty();
        });
    }

    searchProperty() {
        if(this.state.property !== '') {
            return SearchService.searchProperty(this.state.property)
            .then(value=> {
                return value;
            })
            .then(result=>  {
                let sourceArray = [];
                sourceArray =result.map(property=> {
                    return ({
                        address: property.street_address,
                        id: property.id
                    });
                });
                return sourceArray;
            })
            .then(data=>{
                if(data[0]) {
                    this.setState({
                        propertySource: _.pluck(data, 'address'),
                        propertySourceObjects: data
                    });
                }
            });
        }
    }

    onNewPropertyInputRequest() {
        this.setState({
            propertySource: []
        });
    }

    componentDidMount() {
        // Retrieving UserTypes
        UserService.getTypes()
            .then(value => {
                this.setState({
                    type: value
                });
            });
        // Retrieving Categories of Tradies
        UserService.getTradieCategory()
            .then(value => {
                this.setState({
                    tradieCategory: value
                });
            });
        if (PersonStore.propertyId && PersonStore.type) {
            PropertiesService.findProperty(PersonStore.propertyId)
                .then((value) => {
                    this.setState({
                        typeSelection: PersonStore.type,
                        propertySourcessss: [{
                            address: value.status.data.addr_street_address,
                            id: value.status.data.id
                        }],
                        propertySourceObjects: [{
                            address: value.status.data.addr_street_address,
                            id: value.status.data.id
                        }],
                        property: value.status.data.addr_street_address,
                        propertyValue: {
                            address: value.status.data.addr_street_address,
                            id: value.status.data.id
                        }
                    });
                });
        }
    }

    handleClearForm(e) {
        if(this.state.headless) {
            this.props.notifyHeadlessParent(false);
        }
        this.setState({
            initialStage: false
        });
    }

    searchEmail() {
        SearchService.searchUser(this.state.email)
        .then(res=> {
            return res;
        }).then(data => {
            this.setState({
                emailSourceObject: data
            });
            let emailArray = data.map(item=> {
                return item.email;
            });
            this.setState({
                emailSource: emailArray
            });
        });
    }

    handleUpdateEmail(inputValue) {
        // let valid = this.validateEmail(inputValue);
        // valid = valid || this.state.emailSource.length > 0;
        // valid = inputValue === '' ? true : valid;
        this.setState({
            emailValidation: true,
            // emailValidationMessage: 'This email is invalid',
            email: inputValue,
            edit: false
        }, function(){
            this.searchEmail();
        });
    }

    fetchPerson(userId) {
        Person.findOneUser(userId)
            .then(value => {
                this.setState({
                    person: value.data,
                    email: value.data.email,
                    name: value.data.name,
                    phone: value.data.tel_number,
                    phone_country: value.data.tel_country_code ? value.data.tel_country_code: 'AU'
                });
            });
    }

    handleNewEmail() {
        // Getting the user id for existing user
        let hasUser = this.state.emailSource.filter(email=> {
            return email === this.state.email;
        });
        let userId = '';
        if(hasUser.length) {
            let userObject = this.state.emailSourceObject.filter(item=> {
                return item.email === this.state.email;
            });
            userId = userObject ? userObject[0].user_id : '';
            Person.addRole(userId, this.state.formatedType);
            Person.viewPersonRoles(userId, this.state.email, userObject[0].name);

            // Check whether user already has this role
            let hasRole = false;
            Person.findOneUser(userId)
            .then(value => {
                let person = value.data;
                let type = this.state.typeSelection;
                if (type === 'Owner' && person.PropertyOwner !== null) {
                    hasRole = true;
                }
                if (type === 'Tenant' && person.Leases.length) {
                    hasRole = true;
                }
                if (type === 'Strata Manager' && person.StrataManager !== null) {
                    hasRole = true;
                }
                if (type === 'Property Manager' && person.PropertyManager !== null) {
                    hasRole = true;
                }
                if (type === 'Tradie' && person.Tradie !== null) {
                    hasRole = true;
                }
                if (type === 'Inspector' && person.Inspector !== null) {
                    hasRole = true;
                }
                this.handleExistingEmail(hasRole, userId);
            })
        } else {
            this.handleNotFoundEmail();
        }
    }

    handleExistingEmail(hasRole, userId) {
        if(!this.state.headless) {
            if (hasRole) {
                Toastr.error('This user already has this role');
            } else {
                window.location.href = '/#/view-person/' + OptimalHash.encode(userId);
            }
        } else {
            Person.notAddingRole();
            this.fetchPerson(userId);
            this.setState({
                initialStage: true,
                edit: true
            });
            if(this.state.headless) {
                this.props.notifyHeadlessParent(true);
            }
        }
    }

    formatUserRole(role) {
        return role.replace(' ', '_').toLowerCase();
    }

    handleTypeSelect(e) {
        this.handleClearForm(e);
        this.setState({
            typeSelection: e.target.value,
            formatedType: this.formatUserRole(e.target.value)
        });
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleCountryCodeChange(country) {

        let newCountry = Countries.filter((item)=> item.code === country);
        let code = newCountry.length ? newCountry[0].dial_code : '+61';

        this.setState({
            countryCode: code,
            country: country
        });
    }

    handlePhoneChange(e) {
        this.setState({
            phone: e.target.value.replace(/^0/, '')
        });
    }

    onMailingAddressSuggestionsFetchRequested({value}) {
        getSuggestions(value)
            .then(dataSource => {
                this.setState({
                    suggestions: dataSource
                });
            });
    }

    onMailingAddressSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    onMailingAddressSuggestionSelected(e, {suggestion}) {
        this.setState({
            mailingAddressValue: suggestion.streetAddress,
            propertyValue: suggestion
        });
    }

    handleMailingAddressInputChange(e, {newValue, method}) {
        this.setState({
            mailingAddressValue: newValue
        });
    }

    renderDisabledInput(label, value) {
        return (<div className="form-group row element">
            <label className="form-label col-xs-4">{label}</label>
            <input type="text" className="form-input col-xs-8" value={value || ''} disabled />
        </div>);
    }

    renderOtherInputs() {
        const { mailingAddressValue, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Search',
            value: mailingAddressValue,
            onChange: this.handleMailingAddressInputChange
        };

        const PropertyInput = (
            <SearchInput
                title="Property Address"
                dataSource={this.state.propertySource}
                onUpdateInput={this.onUpdatePropertyInput}
                onNewRequest={this.onNewPropertyInputRequest}
                inputValue={this.state.property} />
        );

        const CompanyInput = (
            <SingleInput
                inputType={'text'}
                title={'Company'}
                name={'company'}
                controlFunc={this.handleCompanyChange}
                content={this.state.company} />
        );

        const WebsiteInput = (
            <WebInput
                inputType={'text'}
                title={'Website'}
                name={'website'}
                controlFunc={this.handleWebsiteChange}
                content={this.state.website} />
        );

        const NameInput = this.state.edit ? (
            <SingleInput
                inputType={'text'}
                title={'Name'}
                name={'name'}
                controlFunc={this.handleNameChange}
                content={this.state.name || ''} />
        ) : this.renderDisabledInput('Name', this.state.name || '');

        let customLeaseText = "Loading...";
        if (this.props.Leases && this.props.type === 'Tenant') {
            customLeaseText = this.props.Leases[0].lease_type === 1 ? 'Periodic ' + moment(this.props.Leases[0].lease_start_date).format('DD/MM/YYYY') : 'Fixed ' + moment(this.props.Leases[0].lease_start_date).format('DD/MM/YYYY')
            + ' - ' + moment(this.props.Leases[0].lease_end_date).format('DD/MM/YYYY');
        }
        let leaseText = this.props.leaseText ? this.props.leaseText : customLeaseText;
        const LeaseInput = this.renderDisabledInput('Lease', leaseText);

        const NameInputOld = (
            <SingleInput
                inputType={'text'}
                title={'Name'}
                name={'name'}
                controlFunc={this.handleNameChange}
                content={this.state.name || ''} />
        );

        const PhoneNumberInput = <EditablePhoneInput
            onPhoneChange={this.handlePhoneChange}
            edit={this.state.edit}
            number={this.state.phone || this.props.phone || ''}
            countryCode={this.state.countryCode || '+61'}
            country={this.props.phoneCountry || 'AU'}
            onCountryCodeChange={this.handleCountryCodeChange} />

        const MailingAddressInput = () => {
            if (this.state.hasCustomMailingAddress) {
                return <div>
                    <div className="form-group row element">
                        <label className="form-label col-xs-4">Mailing Address</label>
                        <div className="col-xs-8 no-padding">
                            <div className="row input_field custom-address-strt">
                                <p className="col-xs-11 custom-address-strt">Custom Address</p>
                                <div onClick={this.handleDeActivateCustomMailingAddress} className="property-cancel-icon">
                                    <img src={cancelIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomAddress
                        onChangeAddress={(data)=> {
                            this.handleNewCustomAddress(data)
                        }}
                        value={this.state.customAddressValue}
                        inputWrapClass="col-xs-8 no-padding view-roles-custom-address-padding-fix"
                        labelWrapClass="form-label col-xs-4"
                        handleClose={this.handleDeActivateCustomMailingAddress}/>
                </div>
            } else {
                return <div className="form-group row element single-input address-input mappify-address">
                    <label className="form-label col-xs-4">Mailing Address</label>
                    <div className="col-xs-8">
                        <AutoSuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onMailingAddressSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onMailingAddressSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            getSectionSuggestions={getSectionSuggestions}
                            inputProps={inputProps}
                            renderInputComponent={renderInputComponent}
                            onSuggestionSelected={this.onMailingAddressSuggestionSelected} />
                    {this.state.customAddressEnabled &&
                    <div className="col-xs-2 cant-find-div">
                        <p className="customAddress-trigger MA-cantFind" onClick={this.handleActivateCustomMailingAddress}>Can't Find it?</p>
                    </div>}
                  </div>
                </div>
            }
        }
        const MailingAddressInput1 = () => <div className="form-group row element single-input address-input mappify-address">
                    <label className="form-label col-xs-4">Mailing Address</label>
                    <div className="col-xs-8 no-padding">
                        <AutoSuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onMailingAddressSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onMailingAddressSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            getSectionSuggestions={getSectionSuggestions}
                            inputProps={inputProps}
                            renderInputComponent={renderInputComponent}
                            onSuggestionSelected={this.onMailingAddressSuggestionSelected} />
                    </div>
                </div>



        const TradieCateogryInput = (
            <CategorySelect
                title={'Category'}
                name={'selectedCategory'}
                placeholder={'Other'}
                controlFunc={this.handleCategorySelect}
                otherControlFunc={this.handleOtherCategory}
                options={this.state.tradieCategory}
                selectedOption={this.state.selectedCategory}
                otherValue={this.state.otherCategory} />
        );

        const OwnerInputs = (
            <div>
                {NameInput}
                {!this.state.headless && PropertyInput}
                {PhoneNumberInput}
            </div>
        );

        const TenantInputs = (
            <div>
                {NameInput}
                {!this.state.headless && PropertyInput}
                {LeaseInput}
                {PhoneNumberInput}
            </div>
        );

        const TradieInputs = (
            <div>
                {NameInput}
                {PhoneNumberInput}
                {MailingAddressInput()}
                {CompanyInput}
                {WebsiteInput}
                {TradieCateogryInput}
            </div>
        );

        const StrataManagerInputs = (
            <div>
                {NameInput}
                {PhoneNumberInput}
                {MailingAddressInput()}
            </div>
        );

        const PropertyManagerInputs = (
            <div>
                {NameInput}
                {PhoneNumberInput}
                {MailingAddressInput()}
                {CompanyInput}
            </div>
        );

        const InspectorInputs = (
            <div>
                {NameInput}
                {/*{PropertyInput}*/}
                {PhoneNumberInput}
                {MailingAddressInput()}
            </div>
        );

        if(this.state.initialStage) {
            return(
                <div className="person-role-form">
                    {this.state.typeSelection === 'Owner' && OwnerInputs}
                    {this.state.typeSelection === 'Tenant' && TenantInputs}
                    {this.state.typeSelection === 'Tradie' && TradieInputs}
                    {this.state.typeSelection === 'Strata Manager' && StrataManagerInputs}
                    {this.state.typeSelection === 'Property Manager' && PropertyManagerInputs}
                    {this.state.typeSelection === 'Inspector' && InspectorInputs}
                    <div className="col-xs-8 col-xs-offset-4 action-buttons">
                        <button type="submit" className="button button_main"
                            disabled={false} value="Save">Save
                                </button>
                        <button type="reset" className="button" disabled={false}
                            value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                    </div>
                </div>
            )
        }
    }

    handleNotFoundEmail() {
        Person.notAddingRole();
        let valid = this.validateEmail(this.state.email);
        if(valid) {
            this.setState({
                initialStage: true,
                edit: true,
                emailValidation: true,
                emailValidationMessage: '',
            });
            if (this.state.headless) {
                this.props.notifyHeadlessParent(true);
            }
        } else {
            this.setState({
                emailValidationMessage: 'This email is invalid',
                emailValidation: false
            });
        }
    }

    renderEmailInput() {
        if(this.state.initialStage) {
            return (<div className="form-group row element">
                <label className="form-label col-xs-4">Emails</label>
                <div className="col-xs-8 EmailInputGroup input-width">
                    <input type="text" className="form-input EmailInputGroup__input" value={this.state.email || ''} disabled />
                    <div onClick={this.handleClearForm} className="EmailInputGroup__icon">
                        <img src={cancelIcon} />
                    </div>
                </div>
            </div>);
        }

        return (
            <SearchInput
                title="Email"
                dataSource={this.state.emailSource}
                onUpdateInput={this.handleUpdateEmail}
                onNewRequest={this.handleNewEmail}
                invalid={!this.state.emailValidation}
                validationMessage={this.state.emailValidationMessage}
                inputValue={this.state.email}
                inputClass={'email-validation'}
                handleNotFoundEmail={this.handleNotFoundEmail}
                displayNotFound={!this.state.initialStage && this.state.email && !this.state.emailSource.length && this.state.emailValidation}
                notFoundInput={
                    <div className="display-table">
                        <div className="table-cell text-left notfound__label">No email found.</div>
                        <div className="table-cell"> <img src={plusIcon} />
                            <p className="search-input__notfound__text" onClick={this.handleNotFoundEmail}>
                                Add New?
                            </p>
                        </div>
                    </div>
                }
            />
        );
    }

    validateEmail(email) {
        var x = email;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            return false;
        }
        return true;
    }

    render() {

        if(this.state.headless) {
            return (
                <form className="add-person-form--new-person" onSubmit={this.handleFormSubmit}>
                    <div className="inner-form">
                        {this.renderEmailInput()}
                        {this.renderOtherInputs()}
                    </div>
                </form>
            );
        }
        return (
            <div>
                <form className="add-person-form add-person-form--new-person--role" onSubmit={this.handleFormSubmit}>
                    <div className="form-header">
                        <h1>Add Person</h1>
                    </div>
                    <div className="inner-form">
                        <Select
                            title={'Role'}
                            name={'type'}
                            controlFunc={this.handleTypeSelect}
                            options={SelectionTypes}
                            selectedOption={this.state.typeSelection}/>
                        {this.renderEmailInput()}
                        {this.renderOtherInputs()}
                    </div>
                </form>
            </div>
        );
    }
}

export default AddPersonForm;
