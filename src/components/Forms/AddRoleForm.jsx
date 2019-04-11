import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import SearchService from '../../services/SearchServices.js';
import UserService from '../../services/UserService.js';
import PropertiesService from '../../services/PropertiesServices';
import Person from '../../services/PersonService';
import PersonStore from '../../stores/PersonStore';
import AutoSuggest from 'react-autosuggest';
import ROLES from '../../constants/userRolesConstants';
import ReactPhoneInput from 'react-phone-input';
import EditablePhoneInput from '../elements/EditablePhoneInput.jsx';
import CustomAddress from '../elements/CustomAddress.jsx';

import OptimalHash from '../../utility/optimus.js';
import SearchInput from '../elements/SearchInput.jsx';
import Select from '../elements/Select.jsx';
import SingleInput from '../elements/SingleInput.jsx';
import plusImage from '../../assets/images/plus.png';
import Countries from '../../../data/countries.json';
import PhoneInput from '../elements/PhoneNumber.jsx';
import WebInput from '../elements/WebInput.jsx';
import CategorySelect from '../elements/CategorySelect.jsx';
import cancelIcon from '../../assets/images/cancel.png';
import only from 'only';

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

class AddRoleForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            company: '',
            country: props.phoneCountry.toUpperCase() || 'AU',
            edit: true,
            email: PersonStore.personEmail,
            emailSource: [],
            emailSourceObject: [],
            formatedType: props.role,
            initialStage: false,
            mailingAddressValue: '',
            name: PersonStore.personName,
            otherCategory: '',
            phone: props.phone,
            property: '',
            propertySource: [],
            propertySourceObjects: [],
            suggestions: [],
            selectedCategory: '',
            type: [],
            typeSelection: props.role,
            tradieCategory: [],
            website: '',
            hasCustomMailingAddress: false,
            customAddressEnabled: true
        }
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

        let userTypeName = PersonStore.newRole;
        let userType = '';
        switch (userTypeName) {
            case 'owner':
                userType = ROLES.OWNER;
                break;
            case 'tenant':
                userType = ROLES.TENANT;
                break;
            case 'inspector':
                userType = ROLES.INSPECTOR;
                break;
            case 'property_manager':
                userType = ROLES.PROPERTY_MANAGER;
                break;
            case 'strata_manager':
                userType = ROLES.STRATA_MANAGER;
                break;
            case 'tradie':
                userType = ROLES.TRADIE;
                break;
        }

        let id = this.state.propertySourceObjects.filter(item => {
            return item.address === this.state.property;
        });
        let propertyId = this.state.property
            ? _.findWhere(this.state.propertySourceObjects, { 'address': this.state.property }).id
            : '';
        let tradieCategoryId = this.state.selectedCategory
            ? _.findWhere(this.state.tradieCategory, { 'name': this.state.selectedCategory }).id
            : '';

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
            let userId = null;
            userId = PersonStore.personId;
            Person.viewPerson(userId, userTypeName);
            window.location.href = '/#/view-person/' + OptimalHash.encode(userId) + '/' + userTypeName;
            window.location.reload();
            Person.notAddingRole();
        })
        .catch(error=> Toastr.error(error.error.status.message));
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
                })
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

        let newCountry = Countries.filter((item)=> item.code === this.state.country);
        let code = newCountry.length ? newCountry[0].dial_code : '+61';

        this.setState({
            countryCode: code,
            country: this.state.country
        });

    }

    handleClearForm() {
        window.location.hash = 'add-person';
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
        })
    }

    handleUpdateEmail(inputValue) {
        this.setState({
            email: inputValue
        }, function(){
            this.searchEmail();
        });
    }

    handleNewEmail() {
        this.setState({
            initialStage: true
        });
        // Getting the user id for existing user
        let hasUser = this.state.emailSource.filter(email=> {
            return email === this.state.email;
        });
        let userId = '';
        if(hasUser.length) {
            let emailObject = this.state.emailSourceObject.filter(item=> {
                return item.email === this.state.email;
            });
            userId = emailObject ? emailObject[0].user_id : '';
            Person.addRole(userId, this.state.formatedType);
            // window.location.href = '/#/view-person/' + OptimalHash.encode(userId);
        } else {
            Person.notAddingRole();
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.phoneCountry && !this.state.countryCode) {

            let newCountry = Countries.filter((item)=> item.code === nextProps.phoneCountry);
            let code = newCountry.length ? newCountry[0].dial_code : '+61';

            this.setState({
                countryCode: code,
                country: nextProps.phoneCountry
            }, function(){
                this.forceUpdate();
            });
        }
    }

    handleCountryCodeChange(country) {
      let newCountry = Countries.filter((item)=> item.code === country);
      let code = newCountry.length ? newCountry[0].dial_code : '+61';

      this.setState({
          countryCode: code,
          country: country
      });
        this.props.updateParentPhone(null, country, code);
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
            <div className="company-input"><SingleInput
                inputType={'text'}
                title={'Company'}
                name={'company'}
                controlFunc={this.handleCompanyChange}
                content={this.state.company || ''} /></div>
        );

        const WebsiteInput = (
            <WebInput
                inputType={'text'}
                title={'Website'}
                name={'website'}
                controlFunc={this.handleWebsiteChange}
                content={this.state.website || ''} />
        );

        const NameInput = (
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
            countryCode={this.state.countryCode}
            country={this.state.country}
            onCountryCodeChange={this.handleCountryCodeChange} />

        const MailingAddressInput1 = (
            <div className="form-group row element single-input address-input mappify-address">
                <label className="form-label col-xs-4">Mailing Address</label>
                <div className="col-xs-8 input-width no-padding">
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
        );

        const MailingAddressInput = () => {
            if (this.state.hasCustomMailingAddress) {
                return <div>
                    <div className="form-group row element">
                        <label className="form-label col-xs-4">Mailing Address</label>
                        <div className="col-xs-8 input-width no-padding">
                            <div className="row">
                                <p className="col-xs-11">Custom Address</p>
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
                        inputWrapClass="col-xs-8 input-width no-padding view-roles-custom-address-padding-fix"
                        labelWrapClass="form-label col-xs-4"
                        handleClose={this.handleDeActivateCustomMailingAddress}/>
                </div>
            } else {
                return <div className="form-group row element single-input address-input mappify-address">
                    <label className="form-label col-xs-4">Mailing Address</label>
                    <div className="col-xs-8 input-width no-padding">
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
                            <div>
                              <p className="customAddress-trigger MA-cantFind" onClick={this.handleActivateCustomMailingAddress}>Can't Find?</p>
                            </div>}
                    </div>
                </div>
            }
        }

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
                {PropertyInput}
                {PhoneNumberInput}
            </div>
        );

        const TenantInputs = (
            <div>
                {PropertyInput}
                {PhoneNumberInput}
            </div>
        );

        const TradieInputs = (
            <div className='tradie-section'>
                {PhoneNumberInput}
                {MailingAddressInput()}
                {CompanyInput}
                {WebsiteInput}
                {TradieCateogryInput}
            </div>
        );

        const StrataManagerInputs = (
            <div>
                {PropertyInput}
                {PhoneNumberInput}
                {MailingAddressInput()}
            </div>
        );

        const PropertyManagerInputs = (
            <div>
                {PropertyInput}
                {PhoneNumberInput}
                {MailingAddressInput()}
                {CompanyInput}
            </div>
        );

        const InspectorInputs = (
            <div>
                {PhoneNumberInput}
                {MailingAddressInput()}
            </div>
        );

        return(
            <div className="person-role-form has-stripes">
                {this.state.typeSelection === 'owner' && OwnerInputs}
                {this.state.typeSelection === 'tenant' && TenantInputs}
                {this.state.typeSelection === 'tradie' && TradieInputs}
                {this.state.typeSelection === 'strata_manager' && StrataManagerInputs}
                {this.state.typeSelection === 'property_manager' && PropertyManagerInputs}
                {this.state.typeSelection === 'inspector' && InspectorInputs}
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

    render() {
        return (
            <form className={this.props.className +" add-person-form"} onSubmit={this.handleFormSubmit}>
                <div className="inner-form">
                        <div className="form-group row element">
                            <label className="form-label col-xs-4">Email</label>
                            <div className="col-xs-8 input-width EmailInputGroup">
                                <input type="text" className="form-input EmailInputGroup__input" value={this.state.email || ''} disabled />
                                <div onClick={this.handleClearForm} className="EmailInputGroup__icon">
                                    <img src={cancelIcon} />
                                </div>
                            </div>
                        </div>
                        {this.renderOtherInputs()}
                </div>
            </form>
        );
    }
}

export default AddRoleForm;
