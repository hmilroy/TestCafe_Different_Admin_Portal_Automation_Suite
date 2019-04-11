import React from 'react';
import AutoSuggest from 'react-autosuggest';
import _ from 'underscore';
import SearchService from '../../../services/SearchServices';
import PropertyAction from '../../../actions/ProepertyActions';
import Person from '../../../services/PersonService';
import OptimalHash from '../../../utility/optimus';
import BaseComponent from '../../../components/BaseComponent.jsx';
import './search.scss';

function getSuggestions(value) {
    return SearchService.searchAll(value)
        .then(value => {
            return value;
        })
        .then(retrievedSearchTerms => {
            let propertyList = [];
            let personList = [];
            retrievedSearchTerms.data.map(function (item) {
                if (item._type == 'property') {
                    propertyList.push(item);
                } else {
                    let nameAvailable = (!_.isNull(item.name) && !_.isUndefined(item.name));
                    let emailAvailable = (!_.isNull(item.email) && !_.isUndefined(item.email));
                    if (nameAvailable === true) {
                        personList.push(item);
                    } else if (nameAvailable === false && emailAvailable === true) {
                        item.name = item.email;
                        personList.push(item);
                    }
                }
            });
            let property = {
                title: "PROPERTY",
                list: propertyList
            };
            let person = {
                title: "PERSON",
                list: personList
            };
            return [property, person];
        });
}

function getSuggestionValue(suggestion) {
    let value = suggestion.name;
    if (_.isUndefined(suggestion.name)) {
        value = suggestion.street_address;
        if (!_.isUndefined(suggestion.storage_identifier)) {
            let keyNoArr = suggestion.storage_identifier.split("Key:")
            value = value.concat(" (", keyNoArr[1], ")");
        }
    }
    return value;
}

function renderSuggestion(suggestion) {
    let value = suggestion.name;
    if (_.isUndefined(suggestion.name)) {
        value = suggestion.street_address;
        if (!_.isUndefined(suggestion.storage_identifier)) {
            let keyNoArr = suggestion.storage_identifier.split("Key:")
            value = value.concat(" (", keyNoArr[1], ")");
        }
    }

    return (
        <span>{value}</span>
    );
}

function renderSectionTitle(section) {
    return (
        <strong>{section.title}</strong>
    );
}

function getSectionSuggestions(section) {
    return section.list;
}

const renderInputComponent = inputProps => (
    <div className="inputContainer">
        <i className="icofont icofont-search"/>
        <input { ...inputProps} />
    </div>
);

class SearchBar extends BaseComponent {
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: [],
            showClear: false
        };
        this.bindMethods([
            'onChange',
            'onSuggestionsFetchRequested',
            'onSuggestionsClearRequested',
            'onSuggestionSelected',
            'clearSearch'
        ]);
        this.inputElement = null;
        window.hash = OptimalHash;
    }

    clearSearch() {
        this.onSuggestionsClearRequested();
        this.setState({
            value: ''
        });
        this.inputElement.input.focus();
    }

    onSuggestionSelected(event, {suggestion}) {
        if (suggestion.name) {
            let userTypeName = 'owner';
            switch (suggestion.user_type) {
                case "2":
                    userTypeName = 'owner';
                    break;
                case "3":
                    userTypeName = 'tenant';
                    break;
                case "4":
                    userTypeName = 'tradie';
                    break;
                case "5":
                    userTypeName = 'strata_manager';
                    break;
                case "6":
                    userTypeName = 'property_manager';
                    break;
                case "7":
                    userTypeName = 'inspector';
                    break;
            }
            Person.viewPerson(suggestion.id, userTypeName);
            window.location.href = '/#/view-person/' + OptimalHash.encode(suggestion.user_id);
        } else {
            PropertyAction.viewProperty(suggestion.id);
            window.location.href = '/#/view-property/' + OptimalHash.encode(suggestion.id);
        }
    }

    onChange(event, {newValue, method}) {
        this.setState({
            value: newValue,
            showClear: true
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value && nextState.value === '' && this.state.showClear === true) {
            setTimeout(() => {
                this.setState({
                    showClear: false
                });
            }, 500);
        }
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

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: "Search",
            value,
            onChange: this.onChange
        };

        return (
            <div className="global-search">
                <AutoSuggest
                    ref={(element) => this.inputElement = element}
                    multiSection={true}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    renderSectionTitle={renderSectionTitle}
                    getSectionSuggestions={getSectionSuggestions}
                    inputProps={inputProps}
                    renderInputComponent={renderInputComponent}
                    onSuggestionSelected={this.onSuggestionSelected}/>
                {this.state.showClear === true && <div className="GlobalSearchClearButton" onClick={this.clearSearch}></div>}
            </div>
        );
    }
}
export default SearchBar;