import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import AutoSuggest from 'react-autosuggest';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';

import SearchEmailInput from '../elements/SearchEmailInput.jsx';
import PropertySingleInput from '../elements/PropertySingleInput.jsx';

import SearchService from '../../services/SearchServices';
import Person from '../../services/PersonService';
import Property from '../../services/PropertiesServices';
import PropertyAction from '../../actions/ProepertyActions';
import OptimalHash from '../../utility/optimus.js';

import plusIcon from '../../assets/images/plus.png';
import cancelIcon from '../../assets/images/cancel.png';
import CustomAddress from '../elements/CustomAddress.jsx';
import {capitalizeFirstLetter} from '../../utility/helpers.js';
import  './styles/styles.scss';

function getSuggestions(query) {
    return Property.propertySuggestionGlobal(query, 'AU')
        .then(value => {
            return value;
        })
        .then(retrievedSearchTerms => {
            return retrievedSearchTerms.data.address_result;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion;
}

function renderSuggestion(suggestion) {
    return (
        <span>{capitalizeFirstLetter(suggestion.streetAddress)}</span>
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
            ownerState: [],
            selectedOwnerState: 'New',
            emailSelected: false,
            emailValidation: true,
            emailValidationMessage: '',
            name: '',
            email: '',
            dataSource: [],
            dataSourceObjects: [],
            inputValue: '',
            value: '',
            suggestions: [],
            propertyValue: {},
            emailDisabled: true,
            noResult: true,
            propertySelected: false,
            customAddress: false,
            flatNumberPrefix: 'Unit',
            flatNumber: '',
            numberFirst: '',
            numberLast: '',
            streetName: '',
            streetType: 'Avenue',
            suburb: '',
            state: 'NSW',
            postCode: '',
            countryCode: 'AU',
            isTestProperty: false
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleOwnerNameChange = this.handleOwnerNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onNewRequest = this.onNewRequest.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleNotFoundEmail = this.handleNotFoundEmail.bind(this);
        this.handleClearPropertyForm = this.handleClearPropertyForm.bind(this);
        this.handleClearEmailForm = this.handleClearEmailForm.bind(this);
        this.handleCantFind = this.handleCantFind.bind(this);
        this.handleNewCustomAddress = this.handleNewCustomAddress.bind(this);
        this.handleChangeTestProperty = this.handleChangeTestProperty.bind(this);
    }

    componentDidMount() {
        this.setState({
            ownerState: [{
                "id": 1,
                "name": "New"
            }, {
                "id": 2,
                "name": "Existing"
            }]
        })
    }

    onChange(event, {newValue, method}) {
        this.setState({
            value: newValue
        });
    }

    onSuggestionSelected(event, {suggestion}) {
        this.setState({
            value: suggestion.streetAddress,
            propertyValue: suggestion,
            emailDisabled: false,
            propertySelected: true
        })
    }

    handleNewCustomAddress(data) {
        this.setState({
            customAddressValue: data
        });
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

    handleClearPropertyForm() {
        this.setState({
            value: '',
            emailDisabled: true,
            propertySelected: false,
            email: '',
            name: '',
            emailSelected: false,
            inputValue: '',
            customAddress: false
        })
    }

    handleClearEmailForm() {
        this.setState({
            dataSource: [],
            emailSelected: false,
            email: '',
            inputValue: ''
        })
    }

    handleOptionChange(e) {
        this.setState({
            selectedOwnerState: e.target.value
        });
    }

    handlePropertyChange(e) {
        this.setState({
            property: e.target.value
        });
    }

    handleCantFind(e) {
      this.setState({
          emailDisabled: false,
          customAddress: true
      });
    }

    handleOwnerNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value.toLowerCase()
        });
    }

    performSearch() {
        if (this.state.inputValue !== '') {
            return SearchService.searchUser(this.state.inputValue)
                .then(value => {
                    return value;
                })
                .then(retrievedSearchTerms => {
                    // Filter and get only owners
                    this.setState({
                        dataSourceObjects: retrievedSearchTerms
                    });
                    return _.pluck(retrievedSearchTerms, 'email');
                })
                .then(dataSource => {
                    this.setState({
                        dataSource: dataSource
                    });
                });
        }
    }

    onUpdateInput(inputValue) {
        // let valid = this.validateEmail(inputValue);
        // valid = valid || this.state.dataSource.length > 0;
        // valid = inputValue === '' ? true : valid;
        this.setState({
            inputValue: inputValue,
            emailValidation: true
            // emailValidationMessage: 'This email is invalid'
        }, function () {
            this.performSearch();
        });
    }

    onNewRequest(inputValue) {
        let valid = this.validateEmail(inputValue);
        if(!valid) {
            this.setState({
                emailValidation: false,
                emailValidationMessage: 'This email is invalid'
            });
            return;
        }

        if(!this.state.dataSource[0]) {
            this.setState({
                dataSource: [],
                name: '',
                selectedOwnerState: 'New'
            })
        } else {
            this.setState({
                name: _.findWhere(this.state.dataSourceObjects, {'email': this.state.inputValue}).name,
                selectedOwnerState: "Existing"
            });
        }
        this.setState({
            emailSelected: true,
            email: inputValue
        });
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            property: '',
            name: '',
            email: '',
            dataSource: [],
            inputValue: '',
            flatNumberPrefix: 'Unit',
            flatNumber: '',
            numberFirst: '',
            numberLast: '',
            streetName: '',
            streetType: 'Ave',
            suburb: '',
            state: '',
            postCode: '',
            countryCode: 'AU',
            isTestProperty: false
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        // Email validation without new email
        let valid = this.validateEmail(this.state.inputValue);
        if(!valid) {
            this.setState({
                emailValidation: false,
                emailValidationMessage: 'This email is invalid'
            });
            return;
        }

        if(!this.state.emailSelected) { // prevent form submition before email selection;
            return;
        }
        let property = {};
        if(this.state.customAddress) {
            property = this.state.customAddressValue;
        } else {
            property = _.clone(this.state.propertyValue);
            delete property.result_type;
        }

        if(this.state.selectedOwnerState == 'New') {
            Property.addNewProperty(this.state.email, this.state.name, property, '', this.state.customAddress, this.state.isTestProperty)
                .then( result => {
                    Toastr.success(result.status.message);
                    PropertyAction.viewProperty(result.status.data.propertyId);
                    window.location.href="/#/view-property/"+OptimalHash.encode(result.status.data.propertyId);
                })
                .catch(error => {
                    if(error.error.status.code === 660) {
                        Toastr.warning(error.error.status.message);
                        PropertyAction.viewProperty(error.error.status.data.propertyId);
                        window.location.href="/#/view-property/"+OptimalHash.encode(error.error.status.data.propertyId);
                    } else {
                        Toastr.error(error.error.status.message)
                    }
                });
        } else {
            let ownerId =_.findWhere(this.state.dataSourceObjects, {'email': this.state.inputValue}).id;
            let ownerName =_.findWhere(this.state.dataSourceObjects, {'email': this.state.inputValue}).name;
            Property.addNewProperty(this.state.email, ownerName, property, ownerId, this.state.customAddress, this.state.isTestProperty)
                .then( result => {
                    Toastr.success(result.status.message);
                    PropertyAction.viewProperty(result.status.data.propertyId);
                    window.location.href="/#/view-property/"+OptimalHash.encode(result.status.data.propertyId);
                })
                .catch(error => {
                    if(error.error.status.code === 660) {
                        Toastr.warning(error.error.status.message);
                        PropertyAction.viewProperty(error.error.status.data.propertyId);
                        window.location.href="/#/view-property/"+OptimalHash.encode(error.error.status.data.propertyId);
                    } else {
                        Toastr.error(error.error.status.message)
                    }
                });
        }
    }

    handleNotFoundEmail() {
        Person.notAddingRole();
        let valid = this.validateEmail(this.state.inputValue);
        if (valid) {
            this.setState({
                dataSource: [],
                emailSelected: true,
                selectedOwnerState: 'New',
                name: '',
                email: this.state.inputValue,
                emailValidation: true,
                emailValidationMessage: '',
            });
        } else {
            this.setState({
                emailValidationMessage: 'This email is invalid',
                emailValidation: false
            });
        }
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

    handleChangeTestProperty(e) {
        this.setState({
            isTestProperty: e.target.value === 'true'
        });
    }

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: "Property address",
            value,
            onChange: this.onChange
        };
        const menuProps = {
          menuItemStyle: {
            color: '#7f7f7f'
          }
        }
        return (
            <form className="add-person-form" onSubmit={this.handleFormSubmit}>
                <div className="form-header">
                    <h1>Add Property</h1>
                </div>
                <div className="inner-form add-property-form">
                    <div className="form-group row element single-input address-input mappify-address">
                        <label className="form-label col-xs-3">Address</label>
                        <div className="col-xs-9 no-padding add-property-address">
                            {!this.state.propertySelected && !this.state.customAddress && <div className="row">
                                <div className="col-xs-12 col-xs-no-padding">
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
                                      <span className="search-icon"></span>
                                </div>
                                <div className="col-xs-offset-9 col-xs-3 cant-find">
                                    <span className="MA-cantFind" onClick={this.handleCantFind}> Can't Find it? </span>
                                </div>
                            </div>}
                            { this.state.propertySelected && <div className="row">
                                <p className="col-xs-11">{this.state.value}</p>
                                <div onClick={this.handleClearPropertyForm} className="property-cancel-icon">
                                    <img src={cancelIcon} />
                                </div>
                            </div>}
                            { this.state.customAddress && <div className="row ">
                                <p className="col-xs-11 faded">Custom Address</p>
                                <div onClick={this.handleClearPropertyForm} className="property-cancel-icon">
                                    <img className="MA-cancelIcon" src={cancelIcon} />
                                </div>
                            </div>}
                        </div>
                    </div>

                    {this.state.customAddress && <CustomAddress
                        onChangeAddress={(data)=> {
                            this.handleNewCustomAddress(data)
                        }}
                        value={this.state.customAddressValue}
                        inputWrapClass="col-xs-9 no-padding view-roles-custom-address-padding-fix-"
                        labelWrapClass="form-label col-xs-3"
                        countryDisabled={true}
                        handleClose={this.handleDeActivateCustomMailingAddress}/>}

                    <div className={this.state.emailDisabled && 'faded'}>
                        { !this.state.emailSelected && <SearchEmailInput
                            title="Owner Email"
                            dataSource={this.state.dataSource}
                            onUpdateInput={this.onUpdateInput}
                            invalid={!this.state.emailValidation}
                            validationMessage={this.state.emailValidationMessage}
                            onNewRequest={this.onNewRequest}
                            floatingLabelText={'afsdasdf'}
                            inputValue={this.state.inputValue}
                            disable={this.state.emailDisabled}
                            noResult={this.state.noResult}
                            menuProps={menuProps}
                            inputClass={'search-input--default email-validation col-xs-no-padding'}
                            hintText="Owner's email address"
                            displayNotFound={!this.state.emailSelected && this.state.inputValue && !this.state.dataSource.length && this.state.emailValidation}
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
                        />}
                        {this.state.emailSelected && (<div>
                            <div className="row selected-field-row">
                                <label className="col-xs-3">Email</label>
                                <div className="col-xs-9 no-padding">
                                    <div className="row">
                                        <p className="col-xs-11">{this.state.email}</p>
                                        <div onClick={this.handleClearEmailForm} className="property-cancel-icon">
                                            <img src={cancelIcon} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.selectedOwnerState === 'New' && <PropertySingleInput
                                inputType={'text'}
                                title={'Owner name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name} />}
                            {this.state.selectedOwnerState === 'Existing' && <div className="row selected-field-row">
                                <label className="col-xs-3">Owner Name</label>
                                <p className="col-xs-9">{this.state.name}</p>
                            </div>}
                        </div>)}
                    </div>
                    <div className="form-group row element single-input address-input mappify-address">
                        <label className="form-label col-xs-3">Test Property</label>
                        <div className="col-xs-3 radio-select row">
                            <input type="radio"
                                name="testProperty"
                                value={'true'}
                                className="property-radio-button"
                                onChange={this.handleChangeTestProperty}
                                checked={this.state.isTestProperty}/>
                            <div className="property-radio-value property-radio-value--test-property">Yes</div>
                        </div>
                        <div className="col-xs-3 radio-select row">
                            <input type="radio"
                                name="testProperty"
                                value={'false'}
                                className="property-radio-button"
                                onChange={this.handleChangeTestProperty}
                                checked={!this.state.isTestProperty}/>
                            <div className="property-radio-value property-radio-value--test-property">No</div>
                        </div>
                    </div>
                  {  this.state.name && this.state.emailSelected && <div className="bottom-buttons force-left row col-xs-offset-3">
                        <button type="submit" className="button button_main" disabled={false} value="Save">Save</button>
                        <button type="reset" disabled={false} className="button"
                                value="Cancel" onClick={this.handleClearForm}>Cancel
                        </button>
                    </div>}
                </div>
            </form>
        );
    }
}

export default FormContainer;
