import React from 'react';
import {DatePicker} from 'material-ui';

const ViewPropertyForm = (props) => (
    <form className="admin-padding-adjustment add-person-form" onSubmit={props.onSubmit}>
        <div className="form-header">
            <h1>{props.address}<i className="oval"/> <span className="document">PROPERTY</span></h1>
        </div>
        <div className="inner-form view-person">
            <div className="form-group row element">
                <label className="form-label col-xs-6">Sale Price</label>
                <input className="form-input col-xs-6 currency-input"
                       type="currency"
                       value={props.property.sale_price || ''}
                       onChange={props.onPriceChange}
                       disabled={props.editDisabled}/>
            </div>
            <div className="form-group row element">
                <label className="form-label col-xs-6">Bedroom</label>
                <input className="form-input col-xs-6"
                       min="0"
                       type="number"
                       value={props.property.bedrooms || 0}
                       onChange={props.onBedroomChange}
                       disabled={props.editDisabled}/>
            </div>
            <div className="form-group row element">
                <label className="form-label col-xs-6">Bathroom</label>
                <input className="form-input col-xs-6"
                       type="number"
                       min="0"
                       value={props.property.bathrooms || 0}
                       onChange={props.onBathroomChange}
                       disabled={props.editDisabled}/>
            </div>
            <div className="form-group row element">
                <label className="form-label col-xs-6">Parking</label>
                <input className="form-input col-xs-6"
                       type="number"
                       min="0"
                       value={props.property.parking || 0}
                       onChange={props.onParkingChange}
                       disabled={props.editDisabled}/>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Type</label>
                <select
                    name="type"
                    className="form-select col-xs-6"
                    disabled={props.editDisabled}
                    defaultValue={props.property.type}
                    onChange={props.onTypeChange}>
                    <option value="">Select Type</option>
                    <option value="House">House</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="apartment">apartment</option>
                </select>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Swimming Pool?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="pool"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onPoolChange}
                           disabled={props.editDisabled}
                           checked={props.property.swimming_pool}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="pool"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onPoolChange}
                           disabled={props.editDisabled}
                           checked={!props.property.swimming_pool}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Strata Managed?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="strata"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onStrataChange}
                           disabled={props.editDisabled}
                           checked={props.property.strata_managed}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="strata"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onStrataChange}
                           disabled={props.editDisabled}
                           checked={!props.property.strata_managed}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Previous Property Manager?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="previous_property_manager"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onPropertyManagerChange}
                           checked={props.property.previous_property_manager}
                           disabled={props.editDisabled}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="previous_property_manager"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onPropertyManagerChange}
                           disabled={props.editDisabled}
                           checked={!props.property.previous_property_manager}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Water Efficiency Devices Installed?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="w_e_d-Installed"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onWaterEffChange}
                           disabled={props.editDisabled}
                           checked={props.property.water_efficiency_devices}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="w_e_d-Installed"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onWaterEffChange}
                           disabled={props.editDisabled}
                           checked={!props.property.water_efficiency_devices}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Water Separately Metered?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="water_separately_metered"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onWaterMeterChange}
                           disabled={props.editDisabled}
                           checked={props.property.water_seperately_metered}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="water_separately_metered"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onWaterMeterChange}
                           disabled={props.editDisabled}
                           checked={!props.property.water_seperately_metered}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Built Before 1980?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="built_before_80s"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onBuiltBeforeChange}
                           disabled={props.editDisabled}
                           checked={props.property.built_prior_to_1980}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="built_before_80s"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onBuiltBeforeChange}
                           disabled={props.editDisabled}
                           checked={!props.property.built_prior_to_1980}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Has tenant at management start?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="tenantStart"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onTenantManagementChange}
                           disabled={props.editDisabled}
                           checked={props.property.has_tenant_at_management_start}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="tenantStart"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onTenantManagementChange}
                           disabled={props.editDisabled}
                           checked={!props.property.has_tenant_at_management_start}/>
                    <div className="property-radio-value">No</div>
                </div>
            </div>
            <div className="form-group row element main-selection">
                <label className="form-label col-xs-6">Test property?</label>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="testProperty"
                           value={'true'}
                           className="property-radio-button"
                           onChange={props.onTestPropertyChange}
                           disabled={props.editDisabled}
                           checked={props.property.is_test_property}/>
                    <div className="property-radio-value">Yes</div>
                </div>
                <div className="col-xs-3 radio-select row">
                    <input type="radio"
                           name="testProperty"
                           value={'false'}
                           className="property-radio-button"
                           onChange={props.onTestPropertyChange}
                           disabled={props.editDisabled}
                           checked={!props.property.is_test_property}/>
                    <div className="property-radio-value">No</div>
                </div>
                <label className="form-label col-xs-6">Management Start Date</label>
                {props.managementStartDate  &&
                (<DatePicker
                    id="start"
                    hintText="Pick a Date"
                    value={new Date(props.managementStartDate)}
                    onChange={props.handleAgreementChange}
                    disabled={props.editDisabled}
                />)}
                {!props.managementStartDate && (
                    <DatePicker
                        id="start"
                        hintText="Pick a Date"
                        onChange={props.handleAgreementChange}
                        disabled={props.editDisabled}
                    />)}
            </div>
            {!props.editDisabled && (
                <div className="bottom-buttons">
                    <button type="submit" className="save-button" value="Save">Save</button>
                </div>
            )}
            {props.editDisabled && (
                <div className="bottom-buttons">
                    <button value="edit" className="save-button" onClick={props.handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    </form>
);

ViewPropertyForm.propTypes = {
    property: React.PropTypes.object.isRequired,
    managementStartDate: React.PropTypes.string,
    address: React.PropTypes.string.isRequired,
    editDisabled: React.PropTypes.bool.isRequired,
    handleEditClick: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onPriceChange: React.PropTypes.func.isRequired,
    onRentChange: React.PropTypes.func.isRequired,
    onBedroomChange: React.PropTypes.func.isRequired,
    onBathroomChange: React.PropTypes.func.isRequired,
    onParkingChange: React.PropTypes.func.isRequired,
    onStrataChange: React.PropTypes.func.isRequired,
    onPropertyManagerChange: React.PropTypes.func.isRequired,
    onWaterEffChange: React.PropTypes.func.isRequired,
    onWaterMeterChange: React.PropTypes.func.isRequired,
    onBuiltBeforeChange: React.PropTypes.func.isRequired,
    onTenantManagementChange: React.PropTypes.func.isRequired,
    onPoolChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
    onTestPropertyChange: React.PropTypes.func.isRequired,
    handleAgreementChange: React.PropTypes.func.isRequired

};

export default ViewPropertyForm;
