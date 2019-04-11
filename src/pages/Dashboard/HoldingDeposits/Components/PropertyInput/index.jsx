import React from 'react';
import Autosuggest from 'react-autosuggest';
import BaseComponent from '../../../../../components/BaseComponent.jsx';
import SearchService from '../../../../../services/SearchServices';
import {handleError} from '../../../../../utility/helpers';
import './PropertyInput.scss';

const Validation = (props) => <div className="hdValidation__wrapper hdValidation__wrapper--normal">
    <div className="hdValidation hdValidation--property">{props.text}</div>
</div>;

export default class PropertyInput extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            query: '',
            newQuery: '',
            suggestions: []
        };
        this.bindMethods([
            'handleChange',
            'fetchProperties',
            'onSuggestionsFetchRequested',
            'onSuggestionsClearRequested',
            'getSuggestionValue',
            'renderSuggestion',
            'onChange',
            'removePropertyId'
        ]);

        this._mount = false;
    }

     componentWillUnmount() {
         this._mount = false;
     }

    fetchProperties(query) {
        let that = this;
        SearchService.searchProperty(query)
            .then((res) => {
                that.setState({
                    suggestions: res
                });
            })
            .catch((err) => {
                handleError(err);
            })
    }

    componentDidMount() {
        this._mount = true;
    }

    handleChange(e, {newValue}) {

        let that = this;
        this.removePropertyId();
        this.setState({
            type: 'Property',
            query: e.target.value
        }, () => {
            that.props.onChange(that.state);
        });
    }

    onChange(e, {newValue}) {
        this.removePropertyId();
        this.props.resetValidation('property');
        // this.removePropertyId();
        this.setState({
            newQuery: newValue
        });
    }

    onSuggestionsFetchRequested({value}) {
        this.fetchProperties(value);
    }

    onSuggestionsClearRequested(suggestion) {
        // this.removePropertyId();
    }

    removePropertyId() {
        this.props.onChange({
            type: 'property_id',
            value: ''
        });

    }

    getSuggestionValue(suggestion) {
       this.setState({
           value: suggestion.id
       });

       let obj = {
           type: 'property_id',
           value: suggestion.id
       };
       setTimeout(() => {
           this.props.onChange(obj);
       });

       return suggestion.street_address;
    }

    renderSuggestion(suggestion) {
        return(<div>{suggestion.street_address}</div>);
    }

    render() {
        const theme = {
            container:                'hdPropetyAutoComplete__container',
            containerOpen:            'hdPropetyAutoComplete__container--open',
            input:                    ' hdPropetyAutoComplete__input',
            inputOpen:                ' hdPropetyAutoComplete__input--open',
            inputFocused:             ' hdPropetyAutoComplete__input--focused',
            suggestionsContainer:     'hdPropetyAutoComplete__suggestions-container',
            suggestionsContainerOpen: 'hdPropetyAutoComplete__suggestions-container--open',
            suggestionsList:          'hdPropetyAutoComplete__suggestions-list',
            suggestion:               'hdPropetyAutoComplete__suggestion',
            suggestionFirst:          'hdPropetyAutoComplete__suggestion--first',
            suggestionHighlighted:    'hdPropetyAutoComplete__suggestion--highlighted',
            sectionContainer:         'hdPropetyAutoComplete__section-container',
            sectionContainerFirst:    'hdPropetyAutoComplete__section-container--first',
            sectionTitle:             'hdPropetyAutoComplete__section-title'
        };
        const {newQuery, suggestions} = this.state;
        const inputProps = {
            placeholder: 'Property address',
            value: newQuery,
            onChange: this.onChange
        };

        let Input = <div className="hdFormGroup hdFormGroup--property hdFormGroup--relative row">
            <label className="hdLabel " htmlFor="property">Property</label>
            {this.props.edit ?
                <div className="hdPropertyInput">
                    <Autosuggest
                        theme={theme}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                </div>: <label className="hdValueLabel">{newQuery}</label>}
        </div>;

        if (this.props.isValid === false) {
            Input = <div className="hdFormGroup hdFormGroup--relative row">
                <label className="hdLabel " htmlFor="property">Property</label>
                {this.props.edit ?
                    <div className="hdPropertyInput">
                        <Autosuggest
                            theme={theme}
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                        />
                    </div>: <label className="hdValueLabel">{newQuery}</label>}
                <Validation text="Please select a property from the list" />
            </div>;
        }
        let view = Input;

        return view;
    }
}