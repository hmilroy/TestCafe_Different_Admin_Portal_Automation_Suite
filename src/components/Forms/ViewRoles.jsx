import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import only from 'only';
import SearchService from '../../services/SearchServices.js';
import UserService from '../../services/UserService.js';
import PropertiesService from '../../services/PropertiesServices';
import PersonService from '../../services/PersonService';
import CustomAddressService from '../../services/CustomAddressService';
import PersonStore from '../../stores/PersonStore';
import AutoSuggest from 'react-autosuggest';
import OptimalHash from '../../utility/optimus.js';
import {emailValidator} from '../../utility/helpers.js';
import SearchInput from '../elements/SearchInput.jsx';
import EditablePhoneInput from '../elements/EditablePhoneInput.jsx';
import SingleInput from '../elements/SingleInput.jsx';
import plusImage from '../../assets/images/plus.png';
import Countries from '../../../data/countries.json';
import PhoneInput from '../elements/PhoneNumber.jsx';
import WebInput from '../elements/WebInput.jsx';
import CategorySelect from '../elements/CategorySelect.jsx';
import {CountryDropdown} from 'react-country-region-selector';
import Blocker from '../../actions/BlockingActions.js';
import CircularProgress from 'material-ui/CircularProgress';
import CustomAddress from '../elements/CustomAddress.jsx';
import URL from '../../constants/URLConstants.js';
import ReactPhoneInput from 'react-phone-input';
import {handleError} from '../../utility/helpers';
import '../elements/styles/customAddress.scss';
import cancelIcon from '../../assets/images/cancel.png';
import dig from 'object-dig';
import ReactPhoneInput2 from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import moment from 'moment';

function getSuggestions(query, country) {
    return PropertiesService.propertySuggestionGlobal(query, country).
        then((value)=> value).
        then((retrievedSearchTerms)=> retrievedSearchTerms.data.address_result);
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

const renderInputComponent = (inputProps)=>
    <input { ...inputProps} />
;

class ViewRoles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addressCountry: '',
            countryCode: '',
            company: '',
            country: 'au',
            edit: props.edit ? props.edit : false,
            emailSource: [],
            email: props.email,
            headless: props.headless ? props.headless : false,
            initialStage: false,
            mailingAddressValue: props.mailingAddress ? props.mailingAddress : '',
            addressCountryCode: props.userInfo ? props.userInfo.addr_country_code : 'AU',
            name: props.name ? props.name : '',
            otherCategory: '',
            phone: props.phone || '',
            property: '',
            propertyValue: {},
            propertyOwner: {},
            propertySource: [],
            propertySourceObjects: [],
            leases: null,
            person: props.person,
            roleId: '',
            suggestions: [],
            selectedCategory: '',
            tenantProperty: null,
            type: [],
            typeSelection: props.type,
            tradieCategory: [],
            website: '',
            bsb: '',
            accountNumber: '',
            hasResend: this.props.hasResend ? this.props.hasResend : false,
            bankingLoading: false,
            hasCustomMailingAddress: false,
            customAddressValue: {},
            customAddressSet: false,
            customAddressEnabled: true,
            editing: false,
            ownerSignLinkStatus: false,
            ownerSignLink: null
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
        this.updateOtherFields = this.updateOtherFields.bind(this);
        this.normalizeType = this.normalizeType.bind(this);
        this.updatePerson = this.updatePerson.bind(this);
        this.resetState = this.resetState.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleAddressCountryChange = this.handleAddressCountryChange.bind(this);
        this._ismounted = false;
        this.handleResendEmailButtonClickNew = this.handleResendEmailButtonClickNew.bind(this);
        this.getPaymentInfo = this.getPaymentInfo.bind(this);
        this.handleActivateCustomMailingAddress = this.handleActivateCustomMailingAddress.bind(this);
        this.handleDeActivateCustomMailingAddress = this.handleDeActivateCustomMailingAddress.bind(this);
        this.configCustomMailingAddress = this.configCustomMailingAddress.bind(this);
        this.getOwnerSignHash = this.getOwnerSignHash.bind(this);
    }

    resetState() {
        this.setState({
            company: ''
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    handleActivateCustomMailingAddress() {
        this.setState({
            hasCustomMailingAddress: true
        });
    }

    handleDeActivateCustomMailingAddress() {
        this.setState({
            hasCustomMailingAddress: false,
            customAddressValue: null
        });
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.headless) {
            return;
        }
        this.getPaymentInfo();
        this.getOwnerSignHash();
        // Country code
        if (nextProps.phone_country && !this.props.phone_country) {
            let phone_country = nextProps.phone_country.toUpperCase();
                this.handleCountryCodeChange(phone_country);
        }

        if (nextProps.edit !== this.state.edit) {
            if (this._ismounted) {
                this.setState({
                    edit: nextProps.edit
                });
            }
        }

        if (nextProps.person && nextProps.type && !_.isUndefined(nextProps.personAll)) {
            this.resetState();
            this.updateOtherFields(nextProps);
            // Update role id
            let roleId = '';
            let company = '';
            let website = '';
            switch (nextProps.type) {
            case 'owner':
                roleId = nextProps.person.PropertyOwner.id;
                this.configCustomMailingAddress(nextProps.person.PropertyOwner);
                break;
            case 'tenant':
                roleId = nextProps.person.Leases.id;
                break;
            case 'strata_manager':
                roleId = nextProps.person.StrataManager.id;
                company = nextProps.person.StrataManager.company;
                this.configCustomMailingAddress(nextProps.person.StrataManager);
                break;
            case 'property_manager':
                roleId = nextProps.person.PropertyManager.id;
                company = nextProps.person.PropertyManager.company;
                if (!_.isUndefined(nextProps.userInfo) && !_.isUndefined(nextProps.userInfo.company)) {
                    company = nextProps.userInfo.company;
                }
                this.configCustomMailingAddress(nextProps.person.PropertyManager);
                break;
            case 'inspector':
                roleId = nextProps.person.Inspector.id;
                this.configCustomMailingAddress(nextProps.person.Inspector);
                break;
            case 'tradie':
                roleId = nextProps.person.Tradie.id;
                company = nextProps.person.Tradie.company;
                website = nextProps.person.Tradie.website;
                this.configCustomMailingAddress(nextProps.person.Tradie);
                break;
            }

            if (this._ismounted) {
                this.setState({
                    roleId: roleId,
                    company: company,
                    website: website
                });
            }
        }

        if (nextProps.person) {
            let person = nextProps.person;
            this.setState({
                person: person
            });
            // Setting country code
            if (person.PropertyOwner) {
                this.setState({
                    propertyOwner: person.PropertyOwner
                });
            }

            if (person.Leases.length) {
                this.setState({
                    leases: person.Leases
                });
            }
        }

        // Set name
        if (nextProps.name) {
            this.setState({
                name: nextProps.name
            });
        }

        // Set email
        if (nextProps.email) {
            this.setState({
                email: nextProps.email
            });
        }

        // Set Phone number
        if (nextProps.phone) {
            this.setState({
                phone: nextProps.phone
            });
        }

        // Disable Manual Address on view change
        if (this.props.type !== nextProps.type) {
            this.setState({
                hasCustomMailingAddress: false,
                customAddressValue: null
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // Update address for owner
        if (!this.state.addressCountryCode && !_.isEmpty(nextState.propertyOwner)) {
            this.setState({
                addressCountryCode: nextState.propertyOwner.addr_country_code ? nextState.propertyOwner.addr_country_code : 'AU'
            });
        }
        // Update property for tenant
        if (!this.state.leases && nextState.leases) {
            this.setState({
                tenantProperty: nextState.leases[0].Property
            });
        }
        // Configuring Custom Mailing Address for the property -> people tab, when editing
        if (!_.isUndefined(nextProps.person) && !_.isUndefined(nextProps.userInfo) && nextState.customAddressSet === false) {
            this.setState({
                customAddressSet: true
            });
            this.configCustomMailingAddress(nextProps.userInfo);
        }
    }

    updateOtherFields(props) {
        // Mailing address
        let roleValues = null;
        switch (props.type) {
        case 'owner':
            roleValues = props.person.PropertyOwner;
            this.state.property = roleValues.PropertyOwnerships;
            break;
        case 'tenant':
            this.state.property = '';
            break;
        case 'inspector':
            roleValues = props.person.Inspector;
            this.state.property = '';
            break;
        case 'strata_manager':
            roleValues = props.person.StrataManager;
            this.state.property = roleValues.StrataManagements;
            break;
        case 'property_manager':
            roleValues = props.person.PropertyManager;
            this.state.property = roleValues.PropertyManagements;
            break;
        case 'tradie':
            roleValues = props.person.Tradie;
            this.state.tradieCategories = roleValues.categories;
        default:
            break;
        }
        if (roleValues) {
            this.state.mailingAddressValue = roleValues.addr_street_address;
        }
        this.searchProperty();
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

    normalizeType(type) {
        return type.replace(' ', '').replace('_', '').toLowerCase();
    }

    updatePerson() {
        let addressType = '';
        let company = '';
        this.setState({
            editDisabled: true
        });
        let person = {};
        person.name = this.state.name;
        person.email = this.state.email;
        if (this.state.phone) {
            person.tel_number = this.state.phone;
            person.country_code = this.state.country;
        }
        if (this.state.emailChanged) {
            person.email = this.state.person.email;
        }
        if (!_.isEmpty(this.state.propertyValue) && this.props.type === 'owner') {
            person.local_place_info = this.state.propertyValue;
        } else if (!_.isEmpty(this.state.propertyValue)) {
            person.place_info = this.state.propertyValue;
        }
        if (this.state.propertyValue && this.state.propertyValue.streetAddress && this.props.type === 'owner') {

            switch (this.state.propertyValue.result_type) {
            case 'MAP':
                person.local_place_info = _.clone(this.state.propertyValue);
                delete person.local_place_info.result_type;
                addressType = 'MAP';
                break;
            case 'SMT':
                person.us_place_info = _.clone(this.state.propertyValue);
                delete person.us_place_info.result_type;
                delete person.local_place_info;
                addressType = 'MAP';
                break;
            case 'CRF':
                person.other_place_id = this.state.propertyValue.placeId;
                person.address_country_code = this.state.propertyValue.countryCode;
                delete person.local_place_info;
                addressType = 'MAP';
                break;
            case 'GOG':
                person.google_place_id = this.state.propertyValue.placeId;
                delete person.local_place_info;
                addressType = 'MAP';
                break;
            }
        } else if (this.state.value != 'tenant' && this.state.value != 'owner' && this.state.addressChanged) {
            person.local_place_info = _.clone(this.state.propertyValue);
            delete person.local_place_info.result_type;
        }
        let type = '';
        switch (this.props.type) {
        case 'property_manager':
        case 'strata_manager':
            type = this.props.type.toUpperCase();

            break;
        default:
            type = this.props.type;
            break;
        }
        // Handle id: send user id for owner and tenet; send forigne key id for other roles
        switch (type) {
        case 'PROPERTY_MANAGER':
        case 'STRATA_MANAGER':
            if (!_.isUndefined(this.props.userId) && !_.isNull(this.props.userId)) {
                person.id = OptimalHash.decode(this.props.userId);
            }
            let manager = {};
            if (!_.isUndefined(this.props.personAll) && !_.isNull(this.props.personAll) && type === 'PROPERTY_MANAGER') {
                manager = this.props.personAll.PropertyManager;
            }
            if (!_.isUndefined(this.props.personAll) && !_.isNull(this.props.personAll) && type === 'STRATA_MANAGER') {
                manager = this.props.personAll.StrataManager;
            }
            if (!_.isUndefined(manager.id) && !_.isNull(manager.id)) {
                person.id = manager.id;
            }
            break;
        case 'owner':
        case 'tenant':
            if (!_.isUndefined(this.state.person.id) && !_.isNull(this.state.person.id)) {
                person.id = this.state.person.id;
            }

            break;
        case 'tradie':
                // Person.category_name = this.state.selectedCategory;
                // Person.old_cateogry_id = 1;
        default:
            person.id = this.state.roleId;
            break;
        }
        if (this.props.propertyId) {
            // Person.property_id = OptimalHash.decode(this.props.propertyId);
        }
        // Delete person.local_pla  ce_info;

        // Handle Custom Address
        if (this.state.hasCustomMailingAddress == true && !_.isEmpty(this.state.customAddressValue)) {
            person.custom_address = this.state.customAddressValue;
            person = only(person, 'id email name tel_number country_code custom_address country');
        }

        if (this.state.company) {
            person.company = this.state.company;
        }

        Blocker.block();
        // Blocker.unblock();

        PersonService.updatePeople(person, type).
            then((result)=> {
                if (this._ismounted) {
                    this.setState({
                        suggestions: [],
                        valueSelect: '',
                        propertyValue: {}
                    });
                }
                Toastr.success(result.status.message);
                this.makeNonEditable();
                if (!this.state.headless) {
                    this.props.handleParentUpdate();
                }
            }).
            catch((error)=> {
                Toastr.error(error.error.status.message)
            }).
            then(()=> {
                Blocker.unblock()
                if (this.state.headless) {
                    this.props.handleParentUpdate();
                }
            });
    }

    makeNonEditable() {
        this.setState({
            edit: false
        });
        if (!this.state.headless) {
            this.props.makeParentNonEditable();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        // Validation for email
        let isValid = true;
        if (this.email === '') {
            isValid = false;
        } else if (!emailValidator(this.state.email)) {
            isValid = false;
        }
        // Checking for validation
        if(isValid) {
            this.setState({
                editing: false
            });
            this.updatePerson();
        } else {
            Toastr.error("\"email\" must be a valid email");
        }
    }

    handleWebsiteChange(e) {
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
        }, function() {
            this.searchProperty();
        });
    }

    searchProperty() {
        if (this.state.property !== '') {
            return SearchService.searchProperty(this.state.property).
            then((value)=> value).
            then((result)=> {
                let sourceArray = [];
                sourceArray =result.map((property)=> ({
                    address: property.street_address,
                    id: property.id
                }));

                return sourceArray;
            }).
            then((data)=> {
                if (data[0]) {
                    if (this._ismounted) {
                        this.setState({
                            propertySource: _.pluck(data, 'address'),
                            propertySourceObjects: data
                        });
                    }
                }
            });
        }
    }

    onNewPropertyInputRequest() {
        this.setState({
            propertySource: []
        });
    }

    getPaymentInfo() {
        let self = this;
        let person = {};
        if (this.props.person) {
            person = this.props.person;
        } else if (PersonStore.person) {
            person = PersonStore.person;
        } else if (this.state.person) {
            person = this.state.person;
        }
        if (person.id) {
            this.setState({
                bankingLoading: true
            });
            PersonService.getuserPaymentInfo(person.id).
            then((result)=> {
                if (result.data.length && self._ismounted) {
                    this.setState({
                        bsb: result.data[0].pa_bsb_number,
                        accountNumber: result.data[0].pa_account_number
                    });
                }
                if (this._ismounted) {
                    if (result.data.length) {
                        this.setState({
                            bsb: result.data[0].pa_bsb_number,
                            accountNumber: result.data[0].pa_account_number
                        });
                    }
                    this.setState({
                        bankingLoading: false
                    });
                }
            }).
            catch(()=> {
                if (this._ismounted) {
                    this.setState({
                        bankingLoading: false
                    });
                }
            })
        }
    }

    getOwnerSignHash() {
        let self = this;
        let person = {};
        if (this.props.person) {
            person = this.props.person;
        } else if (PersonStore.person) {
            person = PersonStore.person;
        } else if (this.state.person) {
            person = this.state.person;
        }
        if (person.id && this.props.type === 'owner') {
            PersonService.genareteOwnerLoginHash(person.id)
                .then(result => {
                    if (JSON.parse(result).data) {
                        if (self._ismounted) {
                            this.setState({
                                ownerSignLinkStatus: true,
                                ownerSignLink: JSON.parse(result).data.hash
                            })
                        }
                        if (this._ismounted) {
                            this.setState({
                                ownerSignLinkStatus: true,
                                ownerSignLink: JSON.parse(result).data.hash
                            })
                        }
                    }
                })
                .catch(error => {
                    const userNotAvailableCode = 499;
                    // TODO: remove when api is fixed to send this as 'status'
                    if (!_.isUndefined(dig(error, 'statusCode')) && _.isUndefined(dig(error, 'status'))) {
                        error.status = error.statusCode;
                    }
                    let hasError = false;
                    let errorObject = null;
                    let userAvailable = true;
                    // Showing error message only the owner portal account creation is done
                    if (!_.isUndefined(dig(error, 'error'))) {
                        hasError = true;
                        errorObject = JSON.parse(error.error);
                    }
                    if (hasError && !_.isUndefined(dig(errorObject, 'status', 'code')) && errorObject.status.code === userNotAvailableCode) {
                        userAvailable = false;
                    }
                    if (userAvailable === true) {
                        handleError(error);
                    }
                });
        }
    }

    configCustomMailingAddress(person) {
        if (this.state.customAddressEnabled) {
            let customAddressValue = CustomAddressService.customAddressify(person);
            // return
            if (!_.isUndefined(person.addr_type) && person.addr_type === 'CUS') {
                this.setState({
                    hasCustomMailingAddress: true,
                    customAddressValue
                });

            } else {
                this.setState({
                    hasCustomMailingAddress: false,
                    customAddressValue: null
                });
            }
        }
    }

    componentDidMount() {
        this._ismounted = true;
        this.getPaymentInfo();
        this.getOwnerSignHash();
        let phoneCountryCode = this.props.phone_country ? this.props.phone_country.toUpperCase() : 'AU';
        this.handleCountryCodeChange(phoneCountryCode);
        if (PersonStore.person && !_.isUndefined(this.props.personAll)) {
            let person = PersonStore.person;
            let property = null;
            let roleId = '';
            let company = '';
            let website = '';
            let mailingAddressValue = '';
            switch (this.props.type) {
            case 'owner':
                roleId = person.PropertyOwner.id;
                property= person.PropertyOwner.PropertyOwnerships;
                mailingAddressValue = person.PropertyOwner.addr_street_address;
                break;
            case 'tenant':
                roleId = person.Leases.id;
                property = person.Leases;
                this.setState({
                    leases: property
                });
                break;
            case 'strata_manager':
                roleId = person.StrataManager.id;
                company = person.StrataManager.company;
                property = person.StrataManager.StrataManagements;
                mailingAddressValue = person.StrataManager.addr_street_address;
                break;
            case 'property_manager':
                roleId = person.PropertyManager.id;
                company = person.PropertyManager.company;
                property = person.PropertyManager.PropertyManagements;
                mailingAddressValue = person.PropertyManager.addr_street_address;
                break;
            case 'inspector':
                roleId = person.Inspector.id;
                mailingAddressValue = person.Inspector.addr_street_address;
                break;
            case 'tradie':
                roleId = person.Tradie.id;
                company = person.Tradie.company;
                website = person.Tradie.website;
                mailingAddressValue = person.Tradie.addr_street_address;
                break;
            }

            this.setState({
                roleId: roleId,
                company: company,
                website: website,
                property,
                mailingAddressValue
            });

        }

        if (!_.isUndefined(this.props.type) && !_.isNull(this.props.type) && !_.isUndefined(this.props.userInfo) && !_.isNull(this.props.userInfo)) {
            let company = this.state.company;
            if (this.props.type === 'property_manager' && !_.isUndefined(this.props.userInfo.company)) {
                company = this.props.userInfo.company;
            }
            this.setState({
                company
            });
        }


        // Retrieving UserTypes
        UserService.getTypes().
            then((value)=> {
                if (this._ismounted) {
                    this.setState({
                        type: value
                    });
                }
            });

        // Retrieving Categories of Tradies
        UserService.getTradieCategory().
            then((value)=> {
                if (this._ismounted) {
                    this.setState({
                        tradieCategory: value
                    });
                }
            });

        if (PersonStore.propertyId && PersonStore.type) {
            PropertiesService.findProperty(PersonStore.propertyId).
                then((value)=> {
                    if (this._ismounted) {
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
                    }
                });
        }
    }

    handleClearForm(e) {
        this.setState({
            typeSelection: e.target.value,
            customAddressSet: false,
            email: this.props.email
        });
        this.makeNonEditable();
    }

    searchEmail() {
        SearchService.searchUser(this.state.email).
        then((res)=> res).then((data)=> {
            let emailArray = data.map((item)=> item.email);
            this.setState({
                emailSource: emailArray
            });
        })
    }

    handleUpdateEmail(inputValue) {
        this.setState({
            email: inputValue
        }, function() {
            this.searchEmail();
        });
    }

    handleNewEmail() {
        this.setState({
            initialStage: true
        });
    }

    handleTypeSelect(e) {
        this.handleClearForm(e);
        this.setState({
            typeSelection: e.target.value
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
            country: country,
            phone: this.state.phone || this.props.phone
        });
    }

    handlePhoneChange(e) {
        this.setState({
            phone: e.target.value.replace(/^0/, ''),
            editing: true
        });
        if (!this.state.headless) {
            this.props.updateParentPhone(e.target.value.replace(/^0/, ''), null, null);
        }
    }

    onMailingAddressSuggestionsFetchRequested({value}) {
        let country = this.state.addressCountryCode || 'au';

        getSuggestions(value, country).
            then((dataSource)=> {
                if (this._ismounted) {
                    this.setState({
                        suggestions: dataSource
                    });
                }
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
        return <div className="form-group row element">
            <label className="form-label col-xs-4">{label}</label>
            <input type="text" className="form-input col-xs-8" value={value || ''} disabled />
        </div>;
    }

    renderDisabledAddressInput(label, value) {
        return <div className="form-group row element">
            <label className="form-label col-xs-4">{label}</label>
            <div className="col-xs-8 ">
              { value && <ReactPhoneInput2
                country={this.state.addressCountryCode}
                onChange={()=>{}}
                disabled={true} />}
              <input type="text" className="form-input address-disabled" value={value || ''} disabled />
            </div>
        </div>;
    }


    renderPropertyInput(label, value) {
        if (this.state.headless) {
            return null;
        }
        let properties = null;
        let data = value.length ? value : [];
        if (this.props.type === 'tenant') {
            data = this.state.tenantProperty;
            properties = data && <a href={'#/view-property/' + OptimalHash.encode(data.id)}> {data.addr_street_address} </a>;
        } else {
            properties = data.length && data.map((item, index)=> <a key={index} href={'#/view-property/' + OptimalHash.encode(item.Property.id)}> {item.Property.addr_street_address} </a>);
        }

        return <div className="form-group row element">
            <label className="form-label col-xs-4">{label}</label>
            <div className="multi-property-display col-xs-8">
            {properties}
            </div>
        </div>;
    }

    renderCategoryInput(label, value) {
        let data = value.length ? value : [];
        const properties = <div className="multi-property-display">
            {data.map((item, index)=> <p key={index}> {item.name} </p>)}
        </div>;

        return <div className="form-group row element">
            <label className="form-label col-xs-4">{label}</label>
            <div className=" col-xs-8">
                {properties}
            </div>
        </div>;
    }

    renderOtherInputs() {
        const {mailingAddressValue, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Search',
            value: mailingAddressValue ? mailingAddressValue : '',
            onChange: this.handleMailingAddressInputChange
        };

        const PropertyInputEditable = this.state.edit
            ? <SearchInput
                title="Property Address"
                dataSource={this.state.propertySource}
                onUpdateInput={this.onUpdatePropertyInput}
                onNewRequest={this.onNewPropertyInputRequest}
                inputValue={'' || ''} />
         : this.renderPropertyInput('Property Address', this.state.property || '');

        const PropertyInput = this.renderPropertyInput('Property Address', this.state.property || '');

        const CompanyInput = this.state.edit
            ? <div className="company-div"><SingleInput
                inputType={'text'}
                title={'Company'}
                name={'company'}
                controlFunc={this.handleCompanyChange}
                content={this.state.company || ''} /></div>
         : this.renderDisabledInput('Company', this.state.company || '');

        const bsbNumber = this.state.bsb ? this.renderDisabledInput('BSB No', this.state.bsb) : <div></div>;
        const accountNumber = this.state.accountNumber
          ? this.renderDisabledInput('Account No', this.state.accountNumber) : <div></div>;

        const WebsiteInput = this.state.edit
            ? <WebInput
                inputType={'text'}
                title={'Website'}
                name={'website'}
                controlFunc={this.handleWebsiteChange}
                content={this.state.website || ''} />
         : this.renderDisabledInput('Website', this.state.website || '');

        const NameInput = this.state.edit
            ? <div className="name-input"><SingleInput
                inputType={'text'}
                title={'Name'}
                name={'name'}
                controlFunc={this.handleNameChange}
                content={this.state.name || ''} /></div>
         : this.renderDisabledInput('Name', this.state.name || this.props.name || '');

        let customLeaseText = "Loading...";
        if (this.props.person && this.props.person.Leases && this.props.type === 'tenant') {
            customLeaseText = this.props.person.Leases[0].lease_type === 1 ? 'Periodic ' + moment(this.props.person.Leases[0].lease_start_date).format('DD/MM/YYYY') : 'Fixed ' + moment(this.props.person.Leases[0].lease_start_date).format('DD/MM/YYYY')
            + ' - ' + moment(this.props.person.Leases[0].lease_end_date).format('DD/MM/YYYY');
        }
        let leaseText = this.props.leaseText ? this.props.leaseText : customLeaseText;
        const LeaseInput = this.renderDisabledInput('Lease', leaseText);

         let countryCode = this.state.countryCode || '+61';
         let phoneCountry = this.state.country ? this.state.country.toUpperCase() : 'AU';

        if (this.state.headless) {
            let stateCode = this.state.countryCode;
            if (!(stateCode === '+61' || stateCode === '')) {
                countryCode = this.state.countryCode;
            }
        }
        const PhoneNumberInput = <EditablePhoneInput
                                    onPhoneChange={this.handlePhoneChange}
                                    edit={this.state.edit}
                                    number={this.state.phone}
                                    countryCode={countryCode}
                                    country={phoneCountry}
                                    onCountryCodeChange={this.handleCountryCodeChange}/>


        let EditMailingAddressInput = null;
        if (this.state.hasCustomMailingAddress) {
            EditMailingAddressInput = <div >
                <div className="form-group row element">
                    <label className="form-label col-xs-4">Mailing Address</label>
                    <div className="col-xs-8 no-padding input-width">
                        <div className="row">
                            <p className="col-xs-11 custom-address">Custom Address</p>
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
                    inputWrapClass="col-xs-8 no-padding view-roles-custom-address-padding-fix input-width"
                    labelWrapClass="form-label col-xs-4"
                    handleClose={this.handleDeActivateCustomMailingAddress}/>
            </div>
        } else {
            EditMailingAddressInput = <div className="form-group row element single-input address-input mappify-address">
                <label className="form-label col-xs-4">Mailing Address</label>
                  <div className='col-xs-8'>
                  <ReactPhoneInput2
                    country={this.state.addressCountryCode || "AU"}
                    onCountryChange={ (country) => this.handleAddressCountryChange(country) }
                    onChange={ value => this.setState({ value }) }/>
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
        const MailingAddressInput = this.state.edit
            ? <div>
                {EditMailingAddressInput}
            </div>
         : this.renderDisabledAddressInput('Mailing Address', this.state.mailingAddressValue);

        let EditOwnerMailingAddress = null;
        if (this.state.hasCustomMailingAddress) {
            EditOwnerMailingAddress = <div >
                <div className="form-group row element">
                    <label className="form-label col-xs-4">Mailing Address</label>
                    <div className="col-xs-8 no-padding input-width">
                        <div className="row">
                            <p className="col-xs-11 custom-address">Custom Address</p>
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
                    inputWrapClass="col-xs-8 no-padding view-roles-custom-address-padding-fix input-width"
                    labelWrapClass="form-label col-xs-4"
                    handleClose={this.handleDeActivateCustomMailingAddress}/>
            </div>
        } else {
            EditOwnerMailingAddress = <div>
                <div className="form-group row element single-input address-input mappify-address">
                    <label className="form-label col-xs-4">Mailing Address</label>
                      <div className='col-xs-8'>
                      <ReactPhoneInput2
                        country={this.state.addressCountryCode || "AU"}
                        onCountryChange={ (country) => this.handleAddressCountryChange(country) }
                        onChange={()=>{}}/>
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
                            <div className="cant-find-div">
                              <p className="customAddress-trigger MA-cantFind" onClick={this.handleActivateCustomMailingAddress}>Can't Find it?</p>
                            </div>}
                        </div>
                </div>
            </div>
        }

        const MailingAddressInputOwner = this.state.edit
            ? <div>
                {EditOwnerMailingAddress}
            </div>
         : this.renderDisabledAddressInput('Mailing Address', this.state.mailingAddressValue);

        // Edit functionality disabled for now
        const TradieCateogryInput = this.state.edit && false
            ? <CategorySelect
                title={'Category'}
                name={'selectedCategory'}
                placeholder={'Other'}
                controlFunc={this.handleCategorySelect}
                otherControlFunc={this.handleOtherCategory}
                options={this.state.tradieCategory}
                selectedOption={this.state.selectedCategory}
                otherValue={this.state.otherCategory} />
         : this.renderCategoryInput('Category', this.state.tradieCategories || []);

        const Loader = <div className="form-group row center-xs element">
            <label className="form-label col-xs-12">
                <CircularProgress size={30} thickness={2}/>
            </label>

        </div>

        const BankingInfo = this.state.bankingLoading ? <div> {Loader} </div> : <div>{bsbNumber}{accountNumber}</div>;

        const OwnerInputs =
            <div>
                {this.state.headless && NameInput}
                {PropertyInput}
                {PhoneNumberInput}
                {MailingAddressInputOwner}
                {BankingInfo}
            </div>
        ;


        const TenantInputs =
            <div>
                {this.state.headless && NameInput}
                {LeaseInput}
                {PropertyInput}
                {PhoneNumberInput}
                {BankingInfo}
            </div>
        ;

        const TradieInputs =
            <div className='tradie-section'>
                {this.state.headless && NameInput}
                {PhoneNumberInput}
                {MailingAddressInput}
                {CompanyInput}
                {WebsiteInput}
                {TradieCateogryInput}
            </div>
        ;

        const StrataManagerInputs =
            <div>
                {this.state.headless && NameInput}
                {PropertyInput}
                {PhoneNumberInput}
                {MailingAddressInput}
            </div>
        ;

        const PropertyManagerInputs =
            <div>
                {this.state.headless && NameInput}
                {PropertyInput}
                {PhoneNumberInput}
                {MailingAddressInput}
                {CompanyInput}
            </div>
        ;

        const InspectorInputs =
            <div>
                {this.state.headless && NameInput}
                {PhoneNumberInput}
                {MailingAddressInput}
            </div>
        ;

        if (this.state.initialStage || true) {
            return (
                <div className="has-stripes">
                    {this.props.type === 'owner' && OwnerInputs}
                    {this.props.type === 'tenant' && TenantInputs}
                    {this.props.type === 'tradie' && TradieInputs}
                    {this.props.type === 'strata_manager' && StrataManagerInputs}
                    {this.props.type === 'property_manager' && PropertyManagerInputs}
                    {this.props.type === 'inspector' && InspectorInputs}
                    <div className="form-group row element"></div>
                    {this.state.edit &&
                        <div className="col-xs-8 col-xs-offset-4 action-buttons button-group">
                            <button type="submit" className="button button_main"
                                disabled={false} value="Save">Save
                                </button>
                            <button type="reset" className="button" disabled={false}
                                value="Cancel" onClick={this.handleClearForm}>Cancel
                                </button>
                        </div>}
                    {!this.state.edit &&
                    <div className="col-xs-8 col-xs-offset-4 action-buttons button-group">
                        <button type="button" className="button button_main"
                            disabled={false} value="Edit" onClick={this.handleClickEdit}>Edit
                                </button>
                    </div>}
                    </div>
            )
        }
    }

    handleClickEdit() {
        this.setState({
            edit: true
        });
        if (!this.state.headless) {
            this.props.makeParentEditable();
        }
    }

    handleAddressCountryChange(code) {
        let country = 'Australia';
        let newCountry = Countries.filter((item)=> item.code === code);
        country = newCountry.length ? newCountry[0].name : country;

        this.setState({
            addressCountry: country,
            addressCountryCode: code
        });
    }

    handleResendEmailButtonClick() {
        PersonService.resendSignupEmail(this.state.person.id).
            then((result)=> {
                Toastr.success(result.status.message)
            }).
            catch((error)=> Toastr.error(error.error.status.message));
    }

    handleResendEmailButtonClickNew() {
        PersonService.resendSignupEmail(OptimalHash.decode(this.props.userId)).
            then((result)=> {
                Toastr.success(result.status.message)
            }).
            catch((error)=> Toastr.error(error.error.status.message));
    }

    handleNewCustomAddress(data) {
        this.setState({
            customAddressValue: data
        });
    }

    render() {
        let resend = null;
        if (this.state.person && this.props.type === 'owner') {
            resend = this.state.person.is_signedup === 0
                    ? <button className="button resend-button" type="button" onClick={this.handleResendEmailButtonClickNew} >Resend</button>
                    : null;

        } else {
            resend = null;
        }

        return (
            <div className={this.props.className + ' ' + this.props.headless && 'headless'}>
                <form className="add-person-form" onSubmit={this.handleFormSubmit}>
                    <div className="inner-form">
                        {this.state.edit
                            ? <div>
                            <SearchInput
                                title="Email"
                                dataSource={this.state.emailSource}
                                onUpdateInput={this.handleUpdateEmail}
                                onNewRequest={this.handleNewEmail}
                                inputValue={this.state.email ? this.state.email : ''}
                            />
                            </div>
                        : this.state.hasResend
                                ? <div className="form-group row element">
                                    <label className="form-label col-xs-4">Email</label>
                                    <input type="text" className="form-input col-xs-7" value={this.state.email ? this.state.email : ''} disabled />
                                    <div className="col-xs-1">
                                        {resend}
                                    </div>
                                </div>
                                : <div className="form-group row element">
                                    <label className="form-label col-xs-4">Email</label>
                                    <input type="text" className="form-input col-xs-6" value={this.state.email ? this.state.email : ''} disabled />
                                    <div className="owner-sign-link col-xs-2">
                                        {this.state.ownerSignLinkStatus && this.props.type === 'owner' ?
                                            <a target="blank" onClick={this.getOwnerSignHash} href={ URL.OWNER_PORTAL +"#/?t=adminsign&h=" + this.state.ownerSignLink}>Login as this Owner
                                            </a>: <div></div>}
                                    </div>
                                </div>}
                                {this.renderOtherInputs()}
                    </div>

                </form>
            </div>
        );
    }
}

export default ViewRoles
