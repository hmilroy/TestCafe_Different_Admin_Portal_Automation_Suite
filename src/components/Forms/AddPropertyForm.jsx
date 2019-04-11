import React, {Component} from 'react';
import Toastr from 'toastr';
import _ from 'underscore';
import AutoSuggest from 'react-autosuggest';

import SingleInput from '../elements/SingleInput.jsx';
import SearchInput from '../elements/SearchInput.jsx';
import EmailInput from '../elements/EmailInput.jsx';
import RadioSelect from '../elements/RadioSelect.jsx';

import SearchService from '../../services/SearchServices';
import Property from '../../services/PropertiesServices';
import PropertyAction from '../../actions/ProepertyActions';
import OptimalHash from '../../utility/optimus.js';

import  './styles/styles.scss';

function getSuggestions(query) {
    return Property.propertySuggestion(query)
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
            ownerState:[],
            selectedOwnerState: 'New',
            name: '',
            email: '',
            dataSource: [],
            dataSourceObjects: [],
            inputValue: '',
            value: '',
            suggestions: [],
            propertyValue: {}
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleOwnerNameChange = this.handleOwnerNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.onUpdateInput  = this.onUpdateInput.bind(this);
        this.onNewRequest   = this.onNewRequest.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState ({
            ownerState : [{
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
        if(this.state.inputValue !== '') {
            return SearchService.searchUser(this.state.inputValue)
                .then( value => {
                    return value;
                })
                .then( retrievedSearchTerms => {
                    // Filter and get only owners
                    this.setState({
                        dataSourceObjects: _.where(retrievedSearchTerms, {'user_type': '2'})
                    });
                    return _.pluck( _.where(retrievedSearchTerms, {'user_type': '2'}), 'name');
                })
                .then( dataSource => {
                    this.setState({
                        dataSource : dataSource
                    });
                });
        }
    }

    onUpdateInput(inputValue) {
        this.setState({
            inputValue : inputValue
        }, function(){
            this.performSearch();
        });
    }

    onNewRequest() {
        this.setState({
            dataSource : []
        });
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            property: '',
            name: '',
            email: '',
            dataSource: [],
            inputValue: ''
        });
    }

    handleFormSubmit(e) {
    e.preventDefault();
    if(this.state.selectedOwnerState == 'New') {
        Property.addNewProperty(this.state.email, this.state.name, this.state.propertyValue, '')
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
        let ownerId =_.findWhere(this.state.dataSourceObjects, {'name': this.state.inputValue}).id;
        Property.addNewProperty('', '', this.state.propertyValue, ownerId)
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
                    <h1>Add Property</h1>
                </div>
                <div className="inner-form">
                    <div className="form-group row element single-input address-input mappify-address">
                        <label className="form-label col-xs-4">Property Address</label>
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
                    <RadioSelect
                        name="owner"
                        title="New owner or existing?"
                        ownerStates={this.state.ownerState}
                        selectedOwnerState={this.state.selectedOwnerState}
                        controlFunc={this.handleOptionChange}/>

                    {/*For New Owner*/}
                    { (this.state.selectedOwnerState === "New") && (
                        <div>
                            <SingleInput
                                inputType={'text'}
                                title={'Owner name'}
                                name={'name'}
                                controlFunc={this.handleOwnerNameChange}
                                content={this.state.name} />
                            <EmailInput
                                inputType={'text'}
                                title={'Owner emailq'}
                                name={'email'}
                                controlFunc={this.handleEmailChange}
                                content={this.state.email} />
                        </div>
                    )}

                    {/*For Existing Owner*/}
                    { (this.state.selectedOwnerState === "Existing") && (
                        <div>
                            <SearchInput
                                title="Owner name"
                                dataSource={this.state.dataSource}
                                onUpdateInput={this.onUpdateInput}
                                onNewRequest={this.onNewRequest}
                                inputValue={this.state.inputValue}/>
                        </div>
                    )}
                    <div className="bottom-buttons">
                        <button type="reset" disabled={false}
                                value="Cancel" onClick={this.handleClearForm}>Cancel</button>
                        <button type="submit" className="save-button" disabled={false} value="Save">Save</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default FormContainer;
