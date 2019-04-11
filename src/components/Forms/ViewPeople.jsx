import React from 'react';
import ReactPhoneInput from 'react-phone-input';
import AutoSuggest from 'react-autosuggest';
import SingleInput from '../elements/SingleInput.jsx';
import {CountryDropdown} from 'react-country-region-selector';

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

const ViewPeopleForm = (props) => (
    <form className="add-person-form add-person-form--lined" onSubmit={props.onSubmit}>
        <div className="inner-form view-person">
            { false &&
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-4">Type</label>
                <select
                    name="type"
                    className="form-select col-xs-4"
                    disabled={props.editDisabled}
                    defaultValue={props.userType}>
                    <option value={props.person.role}>{props.userType.toUpperCase()}</option>
                </select>
            </div>
                }

            <div className="form-group row element">
                <label className="form-label col-xs-4">Email</label>
                <input className="form-input col-xs-6"
                    type="email"
                    value={props.person.email || ''}
                    onChange={props.onEmailChange}
                    disabled={props.editDisabled} />
                    {props.editDisabled && props.userType == 'owner' && (<div className="bottom-buttons col-xs-2">
                        <div value="resend" className="resend-button save-button" onClick={props.onResendClick}>
                            Resend
                            </div>
                    </div>
                    )}
            </div>

            <div className="form-group row element">
                <label className="form-label col-xs-4">Name</label>
                <input className="form-input col-xs-8"
                       value={props.person.name || ''}
                       type="text"
                       onChange={props.onNameChange}
                       disabled={props.editDisabled}/>
            </div>
            <div className="form-group row element phone-number-section">
                <label className="form-label col-xs-4">Mobile Phone</label>
                <div className="col-xs-8">
                    <div className="row">
                        {props.editDisabled && (
                            <div className="hide-hover">
                                <ReactPhoneInput
                                    className="form-input col-xs-2"
                                    defaultCountry={props.person.tel_country_code
                                        ? props.person.tel_country_code.toLowerCase() : 'au'}
                                    onChange={props.onMobileCountryChange}
                                    value={props.countryCode}
                                    disabled={props.editDisabled}
                                    onlyCountries={[props.person.tel_country_code]}/>
                            </div>
                        )}
                        {!props.editDisabled && (
                            <div>
                                <ReactPhoneInput
                                    className="form-input col-xs-2"
                                    defaultCountry={props.person.tel_country_code
                                        ? props.person.tel_country_code : 'au' }
                                    onChange={props.onMobileCountryChange}
                                    value={props.countryCode}
                                    disabled={props.editDisabled}/>
                            </div>
                        )}
                        <span className="country-code view-section">
                            {props.countryCode}</span>
                        <input
                            className="form-input col-xs-10 phone-number"
                            name={"Mobile Number"}
                            type={"text"}
                            value={props.person.tel_number ? props.person.tel_number : ''}
                            onChange={props.onMobileNumberChange}
                            disabled={props.editDisabled}/>
                    </div>
                </div>
            </div>
           
            {(props.userType == 'strata_manager' || props.userType == 'property_manager') && !props.editDisabled &&(
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
                </div>
            )}
            {(props.userType == 'tenant' || props.editDisabled) && (
                <div className="form-group row element">
                    <label className="form-label col-xs-4">Mailing address</label>
                    <input className="form-input col-xs-8"
                           type="text"
                           value={props.address || ''}
                           onChange={props.onMailChange}
                           disabled/>
                </div>
            )}

            {props.userType == 'owner' && !props.editDisabled && <div className="form-group row element">
                <label className="form-label col-xs-4">Country</label>
                <CountryDropdown className="form-input col-xs-8"
                                 value={props.addressCountry}
                                 onChange={props.onAddressCountryChange}/>
            </div>}

            {(props.userType == 'owner')
                && (<div>
                {!props.editDisabled && props.addressCountryCode && (
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
                    </div>
                )}
                {!props.editDisabled && !props.addressCountryCode && (
                    <SingleInput
                        inputType={'text'}
                        title={'Mailing Address'}
                        name={'customAddress'}
                        controlFunc={props.onCustomAddressChange}
                        content={props.customAddress}/>
                )}
            </div>)}
            {props.company && (<div className="form-group row element">
                <label className="form-label col-xs-4">Company</label>
                <input className="form-input col-xs-8"
                       value={props.company || ''}
                       type="text"
                       onChange={props.onCompanyChange}
                       disabled={props.editDisabled}/>
            </div>)}
            {props.bsb && (<div className="form-group row element">
                <label className="form-label col-xs-4">BSB No</label>
                <input className="form-input col-xs-8"
                       value={props.bsb}
                       type="text"
                       disabled={true}/>
            </div>)}
            {props.person.website && (<div className="form-group row element">
                <label className="form-label col-xs-4">Website</label>
                <input className="form-input col-xs-8"
                       type="text"
                       value={props.person.website || ''}
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
                    <button type="submit" className="button button_main" value="Save">Save</button>
                  {(props.userType == 'strata_manager' || props.userType == 'property_manager') && !props.editDisabled && (
                    <button type="reset" className="button" disabled={false}
                            value="Cancel" onClick={props.handleClearForm}>Cancel
                    </button>
                  )}
                </div>
            )}
            {props.editDisabled && (
                <div className="col-xs-8 col-xs-offset-4">
                    <div className="bottom-buttons force-left">
                        <button value="edit" className="button button_main" onClick={props.handleEditClick}>Edit</button>
                    </div>
                </div>
            )}
        </div>
    </form>
);

ViewPeopleForm.propTypes = {
    person: React.PropTypes.object.isRequired,
    userType: React.PropTypes.string.isRequired,
    address: React.PropTypes.string,
    bsb: React.PropTypes.string,
    addressCountry: React.PropTypes.string.isRequired,
    company: React.PropTypes.string,
    addressCountryCode: React.PropTypes.string.isRequired,
    ausAddress: React.PropTypes.bool.isRequired,
    customAddress: React.PropTypes.string,
    countryCode: React.PropTypes.string.isRequired,
    editDisabled: React.PropTypes.bool.isRequired,
    handleEditClick: React.PropTypes.func.isRequired,
    handleClearForm: React.PropTypes.func,
    onMobileCountryChange: React.PropTypes.func.isRequired,
    onMobileNumberChange: React.PropTypes.func.isRequired,
    onEmailChange: React.PropTypes.func.isRequired,
    onMailChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onCompanyChange: React.PropTypes.func.isRequired,
    onWebsiteChange: React.PropTypes.func.isRequired,
    onNameChange: React.PropTypes.func.isRequired,
    onCustomAddressChange: React.PropTypes.func.isRequired,
    onAusAddressChange: React.PropTypes.func.isRequired,
    onSuggestionsClearRequested: React.PropTypes.func.isRequired,
    onSuggestionsFetchRequested: React.PropTypes.func.isRequired,
    getSectionSuggestions: React.PropTypes.func.isRequired,
    suggestions: React.PropTypes.array.isRequired,
    inputProps: React.PropTypes.object.isRequired,
    onSuggestionSelected: React.PropTypes.func.isRequired,
    onAddressCountryChange: React.PropTypes.func.isRequired,
    onResendClick: React.PropTypes.func
};

export default ViewPeopleForm;