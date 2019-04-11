import React from 'react';
import ViewPropertyForm from '../../../components/Forms/ViewProperty.jsx';
import PropertyService from '../../../services/PropertiesServices';
import OptimalHash from '../../../utility/optimus.js';
import {handleError} from '../../../utility/helpers.js';
import Toastr from 'toastr';
import _ from 'underscore';

export default class Property extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataReceived: false,
            editDisabled: true,
            property : {},
            address: '',
            managementStartDate: null
        };

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleRentChange = this.handleRentChange.bind(this);
        this.handleBedroomChange = this.handleBedroomChange.bind(this);
        this.handleBathroomChange = this.handleBathroomChange.bind(this);
        this.handleParkingChange = this.handleParkingChange.bind(this);
        this.handlePoolChange = this.handlePoolChange.bind(this);
        this.handleStrataChange = this.handleStrataChange.bind(this);
        this.handlePropertyManagerChange = this.handlePropertyManagerChange.bind(this);
        this.handleWaterEffChange = this.handleWaterEffChange.bind(this);
        this.handleWaterMeterChange = this.handleWaterMeterChange.bind(this);
        this.handleBuiltBeforeChange = this.handleBuiltBeforeChange.bind(this);
        this.handleTenantManagementChange = this.handleTenantManagementChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
		    this.handleTestPropertyChange = this.handleTestPropertyChange.bind(this);
		    this.handleAgreementChange = this.handleAgreementChange.bind(this);
        this._mount = false;
    }

    componentWillMount() {
        this._mount = true;
        let self = this;
        let propertyId = OptimalHash.decode(this.props.params.id);
        // Retrieving Properties info
        PropertyService.viewProperty(propertyId)
            .then(value => {
                if (self._mount) {
                    let formattedAddress = value.status.data.addr_street_address;
                    let property = value.status.data;
                    property.has_tenant_at_management_start = property.has_tenant_at_management_start === 1;
                    let primaryOwnership = _.find(property.PropertyOwnerships, function(ownership) {
                        if(_.isNull(ownership.primary_property_ownership_id)) {
                            return ownership;
                        }
                    });

                    this.setState({
                        property: property,
                        dataReceived: true,
                        address: formattedAddress,
                        managementStartDate: primaryOwnership.agreement_start_at
                    });
                }
            })
            .catch(handleError)
    }

    componentWillUnmount() {
        this._mount = false;
    }

    handlePriceChange(e) {
        let property = this.state.property;
        property.sale_price = e.target.value;

        this.setState({
            property: property
        });
    }

    handleTypeChange(e) {
        let property = this.state.property;
        property.type = e.target.value;

        this.setState({
            property: property
        });
    }

    handleRentChange(e) {
        let property = this.state.property;
        property.current_weekly_rent = e.target.value;

        this.setState({
            property: property
        });
    }

    handleBedroomChange(e) {
        let property = this.state.property;
        property.bedrooms = e.target.value;

        this.setState({
            property: property
        });
    }

    handleStrataChange(e) {
        let property = this.state.property;
        property.strata_managed = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handlePropertyManagerChange(e) {
        let property = this.state.property;
        property.previous_property_manager = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handleWaterEffChange(e) {
        let property = this.state.property;
        property.water_efficiency_devices = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handlePoolChange(e) {
        let property = this.state.property;
        property.swimming_pool = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handleTenantManagementChange(e) {
        let property = this.state.property;
        property.has_tenant_at_management_start = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handleWaterMeterChange(e) {
        let property = this.state.property;
        property.water_seperately_metered = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handleBuiltBeforeChange(e) {
        let property = this.state.property;
        property.built_prior_to_1980 = e.target.value === 'true';
        this.setState({
            property: property
        });
    }

    handleBathroomChange(e) {
        let property = this.state.property;
        property.bathrooms = e.target.value;

        this.setState({
            property: property
        });
    }

    handleParkingChange(e) {
        let property = this.state.property;
        property.parking = e.target.value;

        this.setState({
            property: property
        });
    }

    handleTestPropertyChange(e) {
        let property = this.state.property;
        property.is_test_property = e.target.value === 'true';

        this.setState({
            property: property
        });
    }

    handleEditClick() {
        this.setState({
            editDisabled: false
        });
    }

    handleAgreementChange(e, date) {
        let property=this.state.property;
        property.agreement_start_at = date;
        this.setState({
            managementStartDate: date,
            property: property
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });
        PropertyService.updateProperty(this.state.property)
            .then(result => Toastr.success(result.status.message))
            .catch(handleError);
    }

    get viewPort() {
        if (!this.state.dataReceived) {
            return (
                <div>
                    {/*ToDo: Proper data loading handling*/}
                </div>
            )
        } else {
            return (
                <div className="view-property-comp">
                    <ViewPropertyForm
                        address={this.state.address}
                        property={this.state.property}
                        managementStartDate={this.state.managementStartDate}
                        editDisabled={this.state.editDisabled}
                        handleEditClick={this.handleEditClick}
                        onSubmit={this.handleFormSubmit}
                        onPriceChange={this.handlePriceChange}
                        onRentChange={this.handleRentChange}
                        onBathroomChange={this.handleBathroomChange}
                        onBedroomChange={this.handleBedroomChange}
                        onParkingChange={this.handleParkingChange}
                        onPoolChange={this.handlePoolChange}
                        onStrataChange={this.handleStrataChange}
                        onPropertyManagerChange={this.handlePropertyManagerChange}
                        onWaterEffChange={this.handleWaterEffChange}
                        onWaterMeterChange={this.handleWaterMeterChange}
                        onBuiltBeforeChange={this.handleBuiltBeforeChange}
                        onTypeChange={this.handleTypeChange}
                        onTenantManagementChange={this.handleTenantManagementChange}
						            onTestPropertyChange={this.handleTestPropertyChange}
						            handleAgreementChange={this.handleAgreementChange}
                    />
                </div>
            )
        }
    }

    render() {
        return (this.viewPort);
    }
}
