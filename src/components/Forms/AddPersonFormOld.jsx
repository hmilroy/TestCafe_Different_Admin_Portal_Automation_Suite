import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import AutoSuggest from 'react-autosuggest';

import SingleInput from '../elements/SingleInput.jsx';
import Select from '../elements/Select.jsx';
import EmailInput from '../elements/EmailInput.jsx';
import PhoneInput from '../elements/PhoneNumber.jsx';
import WebInput from '../elements/WebInput.jsx';
import CategorySelect from '../elements/CategorySelect.jsx';
import SearchInput from '../elements/SearchInput.jsx';

import UserService from '../../services/UserService';
import OptimalHash from '../../utility/optimus.js';
import Countries from '../../../data/countries.json';

import './styles/styles.scss';

import SearchService from '../../services/SearchServices';
import PropertiesService from '../../services/PropertiesServices';
import Person from '../../services/PersonService';
import PersonStore from '../../stores/PersonStore';

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

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            property: '',
            address: '',
            name: '',
            type: [],
            typeSelection: 'Owner',
            email: '',
            phone: '',
            countryCode: '+61',
            country: 'au',
            company: '',
            website: '',
            tradieCategory: [],
            dataSource: [],
            dataSourceObjects: [],
            selectedCategory: '',
            otherCategory: '',
            value: '',
            suggestions: [],
            propertyValue: {}
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleTypeSelect = this.handleTypeSelect.bind(this);
        this.handleOwnerNameChange = this.handleOwnerNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleCountryCodeChange = this.handleCountryCodeChange.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleWebChange = this.handleWebChange.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleOtherCategory = this.handleOtherCategory.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onNewRequest = this.onNewRequest.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // Retrieving UserTypes
        UserService.getTypes()
            .then(value => {
                this.setState({
                    type: value
                })
            });

        // Retrieving Categories of Tradies
        UserService.getTradieCategory()
            .then(value => {
                this.setState({
                    tradieCategory: value
                })
            });

        if (PersonStore.propertyId && PersonStore.type) {
            PropertiesService.findProperty(PersonStore.propertyId)
                .then((value) => {
                    this.setState({
                        typeSelection: PersonStore.type,
                        dataSource: [{
                            address: value.status.data.addr_street_address,
                            id: value.status.data.id
                        }],
                        dataSourceObjects: [{
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
        getSuggestions(value)
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

    handleWebChange(e) {
        this.setState({
            website: e.target.value
        });
    }

    handleOwnerNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleOtherCategory(e) {
        this.setState({
            otherCategory: e.target.value
        });
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value.toLowerCase()
        });
    }

    handleAddressChange(e) {
        this.setState({
            address: e.target.value
        });
    }

    handleTypeSelect(e) {
        this.handleClearForm(e);
        this.setState({
            typeSelection: e.target.value
        });
    }

    handleCategorySelect(e) {
        this.setState({
            selectedCategory: e.target.value
        });
    }

    handlePhoneChange(e) {
        this.setState({
            phone: e.target.value.replace(/^0+/, '')
        });
    }

    handleCountryCodeChange(code) {
        let country = 'au';
        if (_.findWhere(Countries, {'dial_code': code})) {
            country = _.findWhere(Countries, {'dial_code': code}).code;
        }
        if (country === 'CA') {
            country = 'US';
        }
        this.setState({
            countryCode: code,
            country: country
        });
    }

    handleCompanyChange(e) {
        this.setState({
            company: e.target.value
        });
    }

    performSearch() {
        if (this.state.property !== '') {
            return SearchService.searchProperty(this.state.property)
                .then(value => {
                    return value;
                })
                .then(retrievedSearchTerms => {
                    let dataSourceArray = [];
                    retrievedSearchTerms.map(property => {
                        let formattedAddress = property.street_address;
                        dataSourceArray.push({
                            address: formattedAddress,
                            id: property.id
                        });
                    });
                    return dataSourceArray;
                })
                .then(dataSource => {
                    if (dataSource[0]) {
                        this.setState({
                            dataSource: _.pluck(dataSource, 'address'),
                            dataSourceObjects: dataSource
                        });
                    }
                });
        }
    }

    onUpdateInput(inputValue) {
        this.setState({
            property: inputValue
        }, function () {
            this.performSearch();
        });
    }

    onNewRequest() {
        this.setState({
            dataSource: []
        });
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            property: '',
            address: '',
            name: '',
            email: '',
            countryCode: '+61',
            country: 'au',
            phone: '',
            website: '',
            selectedCategory: '',
            company: '',
            otherCategory: '',
            dataSource: []
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        let userType = _.findWhere(this.state.type, {'name': this.state.typeSelection}).id;
        let userTypeName = _.findWhere(this.state.type, {'name': this.state.typeSelection}).name;

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

            default :
                break;
        }
        let propertyId = this.state.property
            ? _.findWhere(this.state.dataSourceObjects, {'address': this.state.property}).id
            : '';
        let tradieCategoryId = this.state.selectedCategory
            ? _.findWhere(this.state.tradieCategory, {'name': this.state.selectedCategory}).id
            : '';

        Person.addPerson(this.state.email, this.state.name, userType, this.state.country, this.state.phone, propertyId,
            this.state.propertyValue, this.state.company, this.state.website, this.state.otherCategory,
            tradieCategoryId)
            .then(result => {
                Toastr.success(result.status.message);
                //This handle with different user types
                let userId = null;
                switch (userTypeName) {
                    case "owner":
                        userId = result.status.userId;
                        break;

                    case "tenant":
                        userId = result.status.userId;
                        break;

                    case "strata_manager":
                        userId = result.data.strataManagerId;
                        break;

                    case "property_manager":
                        userId = result.data.propertyManagerId;
                        break;

                    case "inspector":
                        userId = result.data.inspectorId;
                        break;

                    case "tradie":
                        userId = result.data.tradieId;
                        break;

                    default :
                        break;
                }
                Person.viewPerson(userId, userTypeName);
                if (PersonStore.propertyId && PersonStore.type) {
                    window.location.href = '/#/view-property/' + OptimalHash.encode(PersonStore.propertyId) + '/people';
                } else {
                    window.location.href = '/#/view-person/' + OptimalHash.encode(userId) + '/' + userTypeName;
                }
            })
            .catch(error => Toastr.error(error.error.status.message));
    }

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: "Search",
            value,
            onChange: this.onChange
        };
        return (
            <form className="add-person-form" onSubmit={this.handleFormSubmit}>
                <div className="form-header">
                    <h1>Add Person</h1>
                </div>
                <div className="inner-form">
                    <Select
                        title={'Type'}
                        name={'type'}
                        controlFunc={this.handleTypeSelect}
                        options={this.state.type}
                        selectedOption={this.state.typeSelection}/>

                    {/*for owner add*/}
                    { (this.state.typeSelection === "Owner") && (
                        <div>
                            <SearchInput
                                title="Property Address"
                                dataSource={this.state.dataSource}
                                onUpdateInput={this.onUpdateInput}
                                onNewRequest={this.onNewRequest}
                                inputValue={this.state.property}/>
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name || ''}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email || ''}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode || '+61'}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="form-group row element single-input address-input mappify-address">
                                <label className="form-label col-xs-4">Mailing Address</label>
                                <div className="col-xs-8 no-padding">
                                    <AutoSuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        getSectionSuggestions={getSectionSuggestions}
                                        inputProps={inputProps}
                                        renderInputComponent={renderInputComponent}
                                        onSuggestionSelected={this.onSuggestionSelected}/>
                                </div>
                            </div>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/*for tenant add*/}
                    { (this.state.typeSelection === "Tenant") && (
                        <div>
                            {PersonStore.propertyId && PersonStore.type && (
                                <div className="form-group row element">
                                    <label className="form-label col-xs-4">Property</label>
                                    <input className="form-input col-xs-8"
                                           type="text"
                                           value={this.state.property}
                                           disabled/>
                                </div>
                            )}
                            {!PersonStore.type && (
                                <SearchInput
                                    title="Property"
                                    dataSource={this.state.dataSource}
                                    onUpdateInput={this.onUpdateInput}
                                    onNewRequest={this.onNewRequest}
                                    inputValue={this.state.property}/>
                            )}
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/*for Tradie add*/}
                    { (this.state.typeSelection === "Tradie") && (
                        <div>
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="form-group row element single-input address-input mappify-address">
                                <label className="form-label col-xs-4">Mailing Address</label>
                                <div className="col-xs-8 no-padding">
                                    <AutoSuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        getSectionSuggestions={getSectionSuggestions}
                                        inputProps={inputProps}
                                        renderInputComponent={renderInputComponent}
                                        onSuggestionSelected={this.onSuggestionSelected}/>
                                </div>
                            </div>
                            <SingleInput
                                inputType={'text'}
                                title={'Company'}
                                name={'company'}
                                controlFunc={this.handleCompanyChange}
                                content={this.state.company}/>
                            <WebInput
                                inputType={'text'}
                                title={'Website'}
                                name={'website'}
                                controlFunc={this.handleWebChange}
                                content={this.state.website}/>
                            <CategorySelect
                                title={'Category'}
                                name={'selectedCategory'}
                                placeholder={'Other'}
                                controlFunc={this.handleCategorySelect}
                                otherControlFunc={this.handleOtherCategory}
                                options={this.state.tradieCategory}
                                selectedOption={this.state.selectedCategory}
                                otherValue={this.state.otherCategory}/>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/*for Strata Manager add*/}
                    { (this.state.typeSelection === "Strata Manager") && (
                        <div>
                            {PersonStore.propertyId && PersonStore.type && (
                                <div className="form-group row element">
                                    <label className="form-label col-xs-4">Property</label>
                                    <input className="form-input col-xs-8"
                                           type="text"
                                           value={this.state.property}
                                           disabled/>
                                </div>
                            )}
                            {!PersonStore.type && (
                                <SearchInput
                                    title="Property"
                                    dataSource={this.state.dataSource}
                                    onUpdateInput={this.onUpdateInput}
                                    onNewRequest={this.onNewRequest}
                                    inputValue={this.state.property}/>
                            )}
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="form-group row element single-input address-input mappify-address">
                                <label className="form-label col-xs-4">Mailing Address</label>
                                <div className="col-xs-8 no-padding">
                                    <AutoSuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        getSectionSuggestions={getSectionSuggestions}
                                        inputProps={inputProps}
                                        renderInputComponent={renderInputComponent}
                                        onSuggestionSelected={this.onSuggestionSelected}/>
                                </div>
                            </div>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/*for Property Manager add*/}
                    { (this.state.typeSelection === "Property Manager") && (
                        <div>
                            {PersonStore.propertyId && PersonStore.type && (
                                <div className="form-group row element">
                                    <label className="form-label col-xs-4">Property</label>
                                    <input className="form-input col-xs-8"
                                           type="text"
                                           value={this.state.property}
                                           disabled/>
                                </div>
                            )}
                            {!PersonStore.type && (
                                <SearchInput
                                    title="Property"
                                    dataSource={this.state.dataSource}
                                    onUpdateInput={this.onUpdateInput}
                                    onNewRequest={this.onNewRequest}
                                    inputValue={this.state.property}/>
                            )}
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="form-group row element single-input address-input mappify-address">
                                <label className="form-label col-xs-4">Mailing Address</label>
                                <div className="col-xs-8 no-padding">
                                    <AutoSuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        getSectionSuggestions={getSectionSuggestions}
                                        inputProps={inputProps}
                                        renderInputComponent={renderInputComponent}
                                        onSuggestionSelected={this.onSuggestionSelected}/>
                                </div>
                            </div>
                            <SingleInput
                                inputType={'text'}
                                title={'Company'}
                                name={'company'}
                                controlFunc={this.handleCompanyChange}
                                content={this.state.company}/>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}

                    {/*for Inspector add*/}
                    { (this.state.typeSelection === "Inspector") && (
                        <div>
                            <SingleInput
                                inputType={'text'}
                                title={'Name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name}/>
                            <EmailInput
                                inputType={'text'}
                                title={'Email'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email}/>
                            <PhoneInput
                                inputType={'number'}
                                title={'Mobile Phone'}
                                name={'phone'}
                                countryCode={this.state.countryCode}
                                getCountryCode={this.handleCountryCodeChange}
                                getLocal={this.handlePhoneChange}
                                content={this.state.phone}/>
                            <div className="form-group row element single-input address-input mappify-address">
                                <label className="form-label col-xs-4">Mailing Address</label>
                                <div className="col-xs-8 no-padding">
                                    <AutoSuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        getSectionSuggestions={getSectionSuggestions}
                                        inputProps={inputProps}
                                        renderInputComponent={renderInputComponent}
                                        onSuggestionSelected={this.onSuggestionSelected}/>
                                </div>
                            </div>
                            <div className="bottom-buttons">
                                <button type="reset" disabled={false}
                                        value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                                <button type="submit" className="save-button"
                                        disabled={false} value="Save">Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form >
        );
    }
}

export default FormContainer;