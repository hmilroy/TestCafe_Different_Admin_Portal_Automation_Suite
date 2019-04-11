import React from 'react';

import PersonService from '../../../services/PersonService';
import PropertiesService from '../../../services/PropertiesServices';
import PropertyPeople from '../../../components/Forms/PropertyPeople.jsx';
import Toastr from 'toastr';
import PropertyActions from '../../../actions/ProepertyActions';

function getSuggestions(query) {
    return PropertiesService.propertySuggestion(query)
        .then(value => {
            return value;
        })
        .then(retrievedSearchTerms => {
            return retrievedSearchTerms.data.mappify_result;
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
            person : {},
            type: '',
            address: '',
            propertyAddress: '',
            propertyId : '',
            countryCode : '+61',
            suggestions: [],
            value: '',
            propertyValue: {}

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
    }

    componentDidMount() {
        this.fetchPerson();
    }

    fetchPerson() {
        // Retrieving Person's info
        PersonService.findOne(this.props.params.id, this.props.params.type)
            .then(value => {
                let formattedAddress = '';
                let propertyAddress = '';
                let propertyId = '';
                let countryCode ='+61';

                if(value.data.PropertyOwner && this.props.params.type == 'owner') {
                    if (value.data.PropertyOwner) {
                        formattedAddress = value.data.PropertyOwner.addr_street_address;
                    } else {
                        formattedAddress = value.data.addr_street_address;
                    }
                    propertyAddress = value.data.PropertyOwner.PropertyOwnerships[0].Property.addr_street_address;
                    propertyId = value.data.PropertyOwner.PropertyOwnerships[0].Property.id;
                    if(value.data.tel_country_code === 'lk' || value.data.tel_country_code === 'LK') {
                        countryCode = '+94';
                    }

                } else if(value.data.PropertyTenancy && this.props.params.type == 'tenant') {
                    propertyAddress = value.data.PropertyTenancy.Property.addr_street_address;
                    propertyId = value.data.PropertyTenancy.Property.id;
                    if(value.data.tel_country_code === 'lk' || value.data.tel_country_code === 'LK') {
                        countryCode = '+94';
                    }
                } else {
                    switch(this.props.params.type) {
                        case 'strata_manager':
                            propertyAddress = value.data.StrataManagements[0].Property.addr_street_address;
                            propertyId = value.data.StrataManagements[0].Property.id;
                            if(value.data.tel_country_code === 'lk' ||
                                value.data.tel_country_code === 'LK') {
                                countryCode = '+94';
                            }
                            break;
                        case 'property_manager':
                            propertyAddress = value.data.PropertyManagements[0].Property.addr_street_address;
                            propertyId = value.data.PropertyManagements[0].Property.id;
                            if(value.data.tel_country_code === 'lk' ||
                                value.data.tel_country_code === 'LK') {
                                countryCode = '+94';
                            }
                            break;
                        case 'inspector':
                            propertyAddress = value.data.PropertyInspections[0].Property.addr_street_address;
                            propertyId = value.data.PropertyInspections[0].Property.id;
                            if(value.data.tel_country_code === 'lk' ||
                                value.data.tel_country_code === 'LK') {
                                countryCode = '+94';
                            }
                            break;
                    }
                }
                this.setState({
                    person: value.data,
                    type: this.props.params.type,
                    dataReceived: true,
                    address: formattedAddress,
                    value: formattedAddress,
                    propertyAddress: propertyAddress,
                    propertyId: Number(propertyId),
                    countryCode: countryCode
                });
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

    handleMobileCountryChange(e) {
        let country = 'au';
        if(e.target.value == '+94') {
            country = 'lk';
        } else if (e.target.value == '+61') {
            country = 'au';
        }
        let person = this.state.person;
        person.tel_country_code = country;

        this.setState({
            person: person
        });
    }

    handleMobileNumberChange(e) {
        let person = this.state.person;
        person.tel_number = e.target.value;

        this.setState({
            person: person
        });
    }

    handleEmailChange(e) {
        let person = this.state.person;
        person.email = e.target.value;

        this.setState({
            person: person
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
        this.props.router.push('view-property/'+this.state.propertyId);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });

        let person = {};
        person.id = this.props.params.id;
        switch(this.props.params.type) {
            case 'owner':
                person.email = this.state.person.email;
                person.tel_number = this.state.person.tel_number;
                if(this.state.propertyValue) {
                    person.place_info = this.state.propertyValue;
                }
                break;
            case 'tenant':
                person.email = this.state.person.email;
                person.tel_number = this.state.person.tel_number;
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
            .catch(error => Toastr.error(error.status.message));
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
                    <PropertyPeople
                        person={this.state.person}
                        type={this.state.type}
                        address={this.state.address || ''}
                        countryCode = {this.state.countryCode || ''}
                        propertyAddress = {this.state.propertyAddress}
                        propertyId = {this.state.propertyId}
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
                    />
                </div>
            )
        }
    }

    render() {
        return (this.viewPort);
    }
}