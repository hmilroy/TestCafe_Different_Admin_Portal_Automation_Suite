import React from 'react';
import ReactPhoneInput from 'react-phone-input';
import AutoSuggest from 'react-autosuggest';

function getSuggestionValue(suggestion) {
    return suggestion;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.streetAddress}</span>
    );
}

const renderInputComponent = inputProps => (
    <input { ...inputProps} />
);

const PropertyPeople = (props) => (
    <form className="add-person-form" onSubmit={props.onSubmit}>
        <div className="form-header">
            <h1>{props.person.name}</h1>
        </div>
        <div className="inner-form view-person">
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-4">Type</label>
                <select
                    name="type"
                    className="form-select col-xs-4"
                    disabled={props.editDisabled}
                    defaultValue={props.type}>
                    <option value={props.person.role}>{props.type}</option>
                </select>
            </div>
            <div className="form-group row element property-address">
                <label className="form-label col-xs-4">Property</label>
                <a className="form-input col-xs-8 address-field" value={props.propertyId}
                   onClick={props.onPropertyClick}>
                    {props.propertyAddress}
                </a>
            </div>
            <div className="form-group row element phone-number-section">
                <label className="form-label col-xs-4">Mobile Phone</label>
                <div className="col-xs-8">
                    <div className="row">
                        <div className={props.editDisabled ? "hide-hover" : "hide-hover"}>
                            <ReactPhoneInput
                                className="form-input col-xs-2"
                                defaultCountry={props.person.tel_country_code
                                    ? props.person.tel_country_code.toLowerCase() : 'au' }
                                onChange={props.onMobileCountryChange}
                                value={props.countryCode}
                                disabled={props.editDisabled}
                                onlyCountries={[props.tel_country_code]}/>
                        </div>
                        <span className="country-code view-section">{props.countryCode}</span>
                        <input
                            className="form-input col-xs-10 phone-number"
                            name={"Mobile Number"}
                            type={"text"}
                            value={props.person.tel_number || props.person.mobile_number || ''}
                            onChange={props.onMobileNumberChange}
                            disabled={props.editDisabled}/>
                    </div>
                </div>
            </div>
            <div className="form-group row element">
                <label className="form-label col-xs-4">email</label>
                <input className="form-input col-xs-8"
                       value={props.person.email}
                       onChange={props.onEmailChange}
                       disabled={props.editDisabled}/>
            </div>
            {props.type == 'owner' && (<div>
                {props.editDisabled && (<div className="form-group row element">
                    <label className="form-label col-xs-4">Mailing address</label>
                    <input className="form-input col-xs-8"
                           value={props.address}
                           onChange={props.onMailChange}
                           disabled/>
                </div>)}
                {!props.editDisabled && (
                    <div className="form-group row element single-input address-input mappify-address">
                        <label className="form-label col-xs-4">Mailing Address</label>
                        <div className="col-xs-8 no-padding">
                            <AutoSuggest
                                suggestions={props.suggestions}
                                onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={props.onSuggestionsClearRequested}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                getSectionSuggestions={props.getSectionSuggestions}
                                inputProps={props.inputProps}
                                renderInputComponent={renderInputComponent}
                                onSuggestionSelected={props.onSuggestionSelected}/>
                        </div>
                    </div>)}
            </div>)}
            {props.person.company && (<div className="form-group row element">
                <label className="form-label col-xs-4">Company</label>
                <input className="form-input col-xs-8"
                       value={props.person.company}
                       onChange={props.onCompanyChange}
                       disabled={props.editDisabled}/>
            </div>)}
            {props.person.website && (<div className="form-group row element">
                <label className="form-label col-xs-4">Website</label>
                <input className="form-input col-xs-8"
                       value={props.person.website}
                       onChange={props.onWebsiteChange}
                       disabled={props.editDisabled}/>
            </div>)}
            {props.person.category && (<div className="form-group row element">
                <label className="form-label col-xs-4">Category</label>
                <select
                    name="type"
                    className="form-select col-xs-8"
                    disabled={props.editDisabled}
                    defaultValue={props.person.category}>
                    <option value={props.person.category}>{props.person.category}</option>
                </select>
            </div>)}
            {!props.editDisabled && (
                <div className="bottom-buttons">
                    <button type="submit" className="save-button" value="Save">Save</button>
                </div>
            )}
            {props.editDisabled && (
                <div className="bottom-buttons force-left">
                    <button value="edit" className="save-button" onClick={props.handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    </form>
);

PropertyPeople.propTypes = {
    person: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    address: React.PropTypes.string.isRequired,
    countryCode: React.PropTypes.string.isRequired,
    propertyAddress: React.PropTypes.string.isRequired,
    propertyId: React.PropTypes.number.isRequired,
    editDisabled: React.PropTypes.bool.isRequired,
    handleEditClick: React.PropTypes.func.isRequired,
    onMobileCountryChange: React.PropTypes.func.isRequired,
    onMobileNumberChange: React.PropTypes.func.isRequired,
    onEmailChange: React.PropTypes.func.isRequired,
    onMailChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onCompanyChange: React.PropTypes.func.isRequired,
    onWebsiteChange: React.PropTypes.func.isRequired,
    onPropertyClick: React.PropTypes.func.isRequired,
    onSuggestionsClearRequested: React.PropTypes.func.isRequired,
    onSuggestionsFetchRequested: React.PropTypes.func.isRequired,
    getSectionSuggestions: React.PropTypes.func.isRequired,
    suggestions: React.PropTypes.array.isRequired,
    inputProps: React.PropTypes.object.isRequired,
    onSuggestionSelected: React.PropTypes.func.isRequired,
};

export default PropertyPeople;