import React from 'react';
import PropertyService from '../../../services/PropertiesServices';
import BillsAction from '../../../actions/BillsAction';
import PropertyStore from '../../../stores/PropertyStore';
import DatePicker from 'material-ui/DatePicker';
import Statement from './statement/index.jsx';
import Bills from './bills/index.jsx';
import Schedule from './schedule/index.jsx';
import Leases from './leases/index.jsx';
import moment from 'moment';
import OptimalHash from '../../../utility/optimus.js';
import UiService from '../../../services/UiService';
import {cloneObject} from '../../../utility/helpers';
import typecast from 'typecast';

import Toastr from 'toastr';
import './payment.scss';

export default class Payment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'LEASES',
            dataReceived: false,
            property: {},
            editDisabled: true,
            address: '',
            updatedProperty: {},
            primaryOwner: null,
            primaryTenant: null,
            payment_plan_id: null,
            propertyId: OptimalHash.decode(this.props.params.id),
            bond_reference_number: '',
            hasURLAction: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleLeaseStartDate = this.handleLeaseStartDate.bind(this);
        this.handleLeaseEndChange = this.handleLeaseEndChange.bind(this);
        this.handleAgreementChange = this.handleAgreementChange.bind(this);
        this.handleRentPaidChange = this.handleRentPaidChange.bind(this);
        this.handlePaymentPlanChange = this.handlePaymentPlanChange.bind(this);
        this.handlePaymentDebitDateChange = this.handlePaymentDebitDateChange.bind(this);
        this.handleWeeklyRentChange = this.handleWeeklyRentChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.updatePropertyRent = this.updatePropertyRent.bind(this);
        this.handleChangeHasTenantAtStart = this.handleChangeHasTenantAtStart.bind(this);
        this.handleChangeBondRefNumber = this.handleChangeBondRefNumber.bind(this);
        this.updateUpdatedProperty = this.updateUpdatedProperty.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
        this.handleOnTick = this.handleOnTick.bind(this);
		this._mount = false;
        this.handleTenantAtManagementStart = this.handleTenantAtManagementStart.bind(this);
    }

    componentDidMount() {
        this._mount = true;
        let propertyId = this.state.propertyId;
        // Retrieving Properties info
        PropertyService.viewProperty(propertyId);
        PropertyStore.on('change', this.handleStoreChange);
        UiService.changePropertyTab({
            activeTab: "Payment"
        });
    }

    componentWillUnmount() {
        this._mount = false;
        setTimeout(BillsAction.resetBills);
        PropertyStore.removeListener('change', this.handleStoreChange);
    }

    handleStoreChange() {
        this._mount = true;
        let propertyId = this.state.propertyId;
        let self = this;
        let value = PropertyStore.data;

        if (self._mount && value.status.data) {
            let updatedProperty = this.state.updatedProperty;
            updatedProperty.has_tenant_at_management_start = value.status.data.has_tenant_at_management_start === 1 ? 1 : 0;
            if (value.status.data.PropertyTenancies && value.status.data.PropertyTenancies.length) {
                updatedProperty.holding_deposit = value.status.data.PropertyTenancies[0].holding_deposit === 1;
            } else {
                updatedProperty.holding_deposit = false;
            }
            if (value.status.data.PropertyTenancies && value.status.data.PropertyTenancies.length) {
                if (!value.status.data.PropertyTenancies[0].payment_plan_id) {
                    updatedProperty.payment_plan_id = 1;
                    updatedProperty.payment_debit_date = 1;
                } else {
                    updatedProperty.payment_plan_id = value.status.data.PropertyTenancies[0].payment_plan_id;
                }
            }
            let address = value.status.data.addr_street_address;
            this.setState({
                property: value.status.data,
                dataReceived: true,
                address: address,
                updatedProperty: updatedProperty,
                has_tenant_at_management_start: value.status.data.has_tenant_at_management_start === 1
            });
        }
        if (!_.isUndefined(self.props.location.query.action) && self.props.location.query.action === 'addbills' && self._mount) {
            self.props.location.query.action = '';
            self.handleChange('BILLS');
            history.replaceState('','','#' + self.props.location.pathname);
        }
    }

    handleLeaseStartDate(e, date) {
        let Lease = this.state.primaryTenant;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.lease_start_date = date;
        Lease[0].lease_start_date = date;
        let property = this.state.property;
        property.Lease = Lease;

        this.setState({
            primaryTenant: Lease,
            updatedProperty: updatedProperty
        })
    }

    handleOnTick(e) {
        let Lease = this.state.primaryTenant;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.holding_deposit = e.target.checked;
        Lease[0].holding_deposit = e.target.checked;
        let property = this.state.property;
        property.Lease = Lease;

        this.setState({
            primaryTenant: Lease,
            updatedProperty: updatedProperty
        })
    }

    handleAgreementChange(e, date) {
        let PropertyOwnership = this.state.primaryOwner;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.agreement_start_at = date;
        PropertyOwnership[0].agreement_start_at = date;
        let property = this.state.property;
        property.PropertyOwnership = PropertyOwnership;

        this.setState({
            // property: property,
            primaryProperty: PropertyOwnership,
            updatedProperty: updatedProperty
        });
    }

    handleLeaseEndChange(e, date) {
        let Lease = this.state.primaryTenant;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.lease_end_date = date;
        Lease[0].lease_end_date = date;
        let property = this.state.property;
        property.Lease = Lease;

        this.setState({
            primaryTenant: Lease,
            updatedProperty: updatedProperty
        })
    }

    handlePaymentPlanChange(e) {
        let Lease = this.state.property.Leases[0];
        Lease.payment_plan_id = e.target.value;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.payment_plan_id = e.target.value;

        this.setState({
            updatedProperty: updatedProperty,
            payment_plan_id: e.target.value
        });
    }

    handleTenantAtManagementStart(e) {
        let Property = this.state.property;
        Property.has_tenant_at_management_start = e.target.value;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.has_tenant_at_management_start = e.target.value;

        this.setState({
            updatedProperty: updatedProperty,
            has_tenant_at_management_start: e.target.value
        });
    }

    handlePaymentDebitDateChange(e) {
        let Lease = this.state.property.Lease;
        Lease.payment_debit_date = e.target.value;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.payment_debit_date = e.target.value;
        let property = this.state.property;
        property.Lease = Lease;

        this.setState({
            property: property,
            updatedProperty: updatedProperty
        })
    }

    handleRentPaidChange(e, date) {
        let Lease = this.state.primaryTenant;
        Lease[0].rent_paid_until_date = date;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.rent_paid_until_date = date;
        let property = this.state.property;
        property.Lease = Lease;

        this.setState({
            // property: property,
            updatedProperty: updatedProperty
        })
    }

    handleChange(value, e) {
        this.setState({
            value: value,
            editDisabled: true
        });
    };

    handleWeeklyRentChange(e) {
        let property = this.state.property;
        property.current_weekly_rent = e.target.value;
        let updatedProperty = this.state.updatedProperty;
        updatedProperty.current_weekly_rent = e.target.value;
        this.setState({
            property: property,
            updatedProperty: updatedProperty
        });
    }

    handleEditClick() {
        this.setState({
            editDisabled: false
        })
    }

    updatePropertyRent() {
        let self = this;
        PropertyService.updatePropertyRent(this.state.updatedProperty, this.state.property.id)
            .then(result => {
                Toastr.success(result.status.message);
                PropertyService.viewProperty(PropertyStore.propertyId)
                    .then(value => {
                        let address = value.status.data.addr_street_address
                            .substring(0, value.status.data.addr_street_address
                                .indexOf(', ' + value.status.data.addr_suburb));
                        this.setState({
                            property: value.status.data,
                            dataReceived: true,
                            address: address,
                            old_bond_reference_number: self.state.bond_reference_number
                        })
                    })
            })
            .catch(error => {
                if (error.status === 400) {
                    this.setState({
                        bond_reference_number: self.state.old_bond_reference_number
                    });
                }
                PropertyService.viewProperty(PropertyStore.propertyId)
                    .then(value => {
                        let address = value.status.data.addr_street_address
                            .substring(0, value.status.data.addr_street_address
                                .indexOf(', ' + value.status.data.addr_suburb))
                        this.setState({
                            property: value.status.data,
                            dataReceived: true,
                            address: address
                        })
                    });
                Toastr.error(JSON.parse(error.response).status.message);
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });

        if(!this.state.primaryTenant) {
            this.updatePropertyRent();
        } else if (this.state.primaryTenant && moment(this.state.primaryTenant[0].lease_end_date)
                .isBefore(moment(this.state.primaryTenant[0].lease_start_date))) {
            Toastr.error("Lease End Date cannot be earlier than Lease Start Date");
        } /*else if (this.state.primaryTenant && moment(this.state.primaryTenant[0].lease_end_date)
                .isBefore(moment(this.state.primaryTenant[0].rent_paid_until_date))) {
            Toastr.error("Lease End Date cannot be earlier than Rent Paid Until Date");
        } */else if (this.state.primaryTenant && moment(this.state.primaryTenant[0].rent_paid_until_date)
                .isBefore(moment(this.state.primaryTenant[0].lease_start_date))) {
            Toastr.error("Rent Paid Until Date cannot be earlier than Lease Start Date");
        } /*else if (this.state.primaryTenant & moment(this.state.primaryTenant.lease_end_date)
                .isBefore(moment(this.state.primaryOwner[0].agreement_start_at))) {
            Toastr.error("Lease End Date cannot be earlier than Management Start Date");
        }*/ else {
            this.updatePropertyRent();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // Stringify primary owner attributes for comparison
        let thisPrimaryOwnerString = JSON.stringify(this.state.primaryOwner);

        let nextPrimaryOwnerString = null;
        if (!_.isUndefined(nextState.primaryOwner) && !_.isNull(nextState.primaryOwner)) {
            nextPrimaryOwnerString = JSON.stringify(nextState.primaryOwner);
        }

        if(_.isNull(this.state.primaryOwner) && (thisPrimaryOwnerString !== nextPrimaryOwnerString)) {

            // Checking for owners in the data
            let owners = null;
            if (this.state.property.PropertyOwnerships) {
                owners = this.state.property.PropertyOwnerships;
            }
            // Setting Primary Owner
            let primaryOwner = null;
            if (!_.isNull(owners)) {
                primaryOwner = owners.filter(item => {
                    return item.primary_property_ownership_id === null;
                });
            }
            this.setState({
                primaryOwner: primaryOwner
            });
        }

        // let flag = true;
        // if (_.isUndefined(nextState.property.PropertyTenancies)) {
        //     flag = false;
        // }
        if (!_.isUndefined(nextState.property.PropertyTenancies) && this.state.primaryTenant === null && nextState.property && nextState.property.PropertyTenancies.length) {

            let tenants = null;
            if (!_.isNull(this.state.property.PropertyTenancies) && !_.isUndefined(this.state.property.PropertyTenancies)) {
                tenants = this.state.property.PropertyTenancies
            }
            // Set primary tenant
            let primaryTenant = null;
            if (!_.isNull(tenants)) {
                primaryTenant = tenants.filter(item => {
                    return item.primary_property_tenancy_id == null;
                });
            }
            if (!(primaryTenant && primaryTenant.length)) {
                primaryTenant = null;
            }
            this.setState({
                primaryTenant: primaryTenant
            });
        }

        // Update Bond reference number
        let thisPrimaryTenant = JSON.stringify(this.state.primaryTenant);
        let nextPrimaryTenant = JSON.stringify(nextState.primaryTenant);
        if (thisPrimaryTenant !== nextPrimaryTenant && !_.isUndefined(nextState.primaryTenant[0].bond_reference_number)) {
            this.setState({
                bond_reference_number: nextState.primaryTenant[0].bond_reference_number,
                old_bond_reference_number: nextState.primaryTenant[0].bond_reference_number,
            });
        }
    }

    handleChangeHasTenantAtStart(e) {
        let value = parseInt(e.target.value);
        let updatedProperty = cloneObject(this.state.updatedProperty);
        updatedProperty.has_tenant_at_management_start = value;
        this.setState({
            updatedProperty: updatedProperty
        });
    }

    handleChangeBondRefNumber(e) {
        let value = e.target.value;
        let isAllowed = !(value.match(/[^0-9|a-z|A-Z|-]/));
        if (typecast(value, 'string').indexOf(' ') > -1) { // has spaces
            isAllowed = false;
        }
        if (isAllowed) {
            this.setState({
                bond_reference_number: value
            });
            this.updateUpdatedProperty('bond_reference_number', value);
        }
    }

    updateUpdatedProperty(name, value) {
        let updatedProperty = cloneObject(this.state.updatedProperty);
        updatedProperty[name] = value;
        this.setState({updatedProperty});
    }

    render() {
        let rows = [];
        let i = 0;
        while (++i < 28)
        {
            rows.push(<option value={i} key={i}>{i}</option>);
        }

        // Setting current payment plan type for display
        let paymentPlanId = 1;
        if (this.state.payment_plan_id) {
            paymentPlanId = this.state.payment_plan_id;
        } else if (this.state.primaryTenant) {
            if (this.state.primaryTenant[0].payment_plan_id) {
                paymentPlanId = this.state.primaryTenant[0].payment_plan_id;
            } else {
                paymentPlanId = 1;
            }
        }

        let bondRefStyle = {
            width: '256px'
        };

        if (this.state.editDisabled || _.isNull(this.state.primaryTenant)) {
            bondRefStyle = {
                width: '256px',
                borderBottom: '2px dotted rgba(0, 0, 0, 0.3)',
                cursor: 'not-allowed'
            };
        }

        let hasTenantAtManagementStart = this.state.has_tenant_at_management_start;
        if (!_.isUndefined(this.state.updatedProperty.has_tenant_at_management_start)) {
            hasTenantAtManagementStart = this.state.updatedProperty.has_tenant_at_management_start;
        }

        let showEndLeaseNote = false;
        if (!_.isNull(this.state.primaryTenant) && !_.isUndefined(this.state.primaryTenant[0].periodic_lease_status)) {
            if (typecast(this.state.primaryTenant[0].periodic_lease_status, 'number') === 1) {
                showEndLeaseNote = true;
            }
        }

        return (
            <div className="admin-padding-adjustment add-person-form people-tab">
                <div className="section-header">
                    <h1>{this.state.address} <i className="oval"/>
                        <span className="document">PAYMENTS</span> <i className="oval"/>
                        <span className="document">{this.state.value}</span>
                    </h1>
                </div>
                <div className="row col-xs-12">
                   <div className={this.state.value === "LEASES" ? 'active-tab tab' : 'tab'}
                        onClick={() => this.handleChange("LEASES")}>
                        LEASES
                    </div>
                    {/*<div className={this.state.value === "RENT DETAILS" ? 'active-tab tab' : 'tab'}*/}
                         {/*onClick={(e) => this.handleChange("RENT DETAILS", e)}>*/}
                        {/*RENT DETAILS*/}
                    {/*</div>*/}
                    <div className={this.state.value === "PAYMENT SCHEDULE" ? 'active-tab tab' : 'tab'}
                         onClick={() => this.handleChange("PAYMENT SCHEDULE")}>
                        TRANSACTIONS
                    </div>
                    <div className={this.state.value === "STATEMENTS" ? 'active-tab tab' : 'tab'}
                         onClick={(e) => this.handleChange("STATEMENTS", e)}>
                        STATEMENTS
                    </div>
                    <div className={this.state.value === "BILLS" ? 'active-tab tab' : 'tab'}
                         onClick={(e) => this.handleChange("BILLS", e)}>
                        BILLS
                    </div>
                </div>
                {false && this.state.value === "RENT DETAILS" && (
                    <div className="inner-form view-person payment-section">
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Management Start Date</label>
                            {this.state.primaryOwner && this.state.primaryOwner[0] && this.state.primaryOwner[0].agreement_start_at &&
                            (<DatePicker
                                id="start"
                                hintText="Pick a Date"
                                value={new Date(this.state.primaryOwner[0].agreement_start_at)}
                                onChange={this.handleAgreementChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {this.state.primaryOwner && this.state.primaryOwner[0] && !this.state.primaryOwner[0].agreement_start_at &&
                            (<DatePicker
                                id="start"
                                hintText="Pick a Date"
                                onChange={this.handleAgreementChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {!this.state.primaryOwner && (
                                <DatePicker
                                    id="start"
                                    hintText="Pick a Date"
                                    onChange={this.handleAgreementChange}
                                    disabled={true}
                                />)}
                        </div>
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Rent Paid Until Date</label>
                            {this.state.primaryTenant && this.state.primaryTenant.length && this.state.primaryTenant[0].rent_paid_until_date &&
                            (<DatePicker
                                id="rent"
                                hintText="Pick a Date"
                                value={new Date(this.state.primaryTenant[0].rent_paid_until_date)}
                                onChange={this.handleRentPaidChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {(this.state.primaryTenant && this.state.primaryTenant.length && !this.state.primaryTenant[0].rent_paid_until_date) &&
                            (<DatePicker
                                id="rent"
                                hintText="Pick a Date"
                                onChange={this.handleRentPaidChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {!this.state.primaryTenant && (<DatePicker
                                id="rent"
                                hintText="Pick a Date"
                                onChange={this.handleRentPaidChange}
                                disabled={true}
                            />)}
                            <span className="note-text">
                                This is the first date that rent will be debited through the app</span>
                        </div>
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Lease Start Date</label>
                            {this.state.primaryTenant && this.state.primaryTenant[0].lease_start_date &&
                            (<DatePicker
                                id="leaseS"
                                hintText="Pick a Date"
                                value={new Date(this.state.primaryTenant[0].lease_start_date)}
                                onChange={this.handleLeaseStartDate}
                                disabled={this.state.editDisabled}
                            />)}
                            {(this.state.primaryTenant && !this.state.primaryTenant[0].lease_start_date) &&
                            (<DatePicker
                                id="leaseS"
                                hintText="Pick a Date"
                                onChange={this.handleLeaseStartDate}
                                disabled={this.state.editDisabled}
                            />)}
                            {!this.state.primaryTenant && (<DatePicker
                                id="leaseS"
                                hintText="Pick a Date"
                                onChange={this.handleLeaseStartDate}
                                disabled={true}
                            />)}
                        </div>
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Lease End Date</label>
                            {this.state.primaryTenant && this.state.primaryTenant[0].lease_end_date &&
                            (<DatePicker
                                id="leaseE"
                                hintText="Pick a Date"
                                value={new Date(this.state.primaryTenant[0].lease_end_date)}
                                onChange={this.handleLeaseEndChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {this.state.primaryTenant && !this.state.primaryTenant[0].lease_end_date &&
                            (<DatePicker
                                id="leaseE"
                                hintText="Pick a Date"
                                onChange={this.handleLeaseEndChange}
                                disabled={this.state.editDisabled}
                            />)}
                            {!this.state.primaryTenant && (<DatePicker
                                id="leaseE"
                                hintText="Pick a Date"
                                onChange={this.handleLeaseEndChange}
                                disabled={true}
                            />)}
                            {showEndLeaseNote && <span className="note-text">
                                This tenant is now on a periodic lease</span>}
                        </div>
                        <div className="form-group row element">
                            <label className="form-label col-xs-6 col-md-4">Current Weekly Rent</label>
                            <span className="dollar-sign-payment"> $ </span> <input
                            className="form-input col-xs-6 col-md-4"
                            type="currency"
                            value={this.state.property.current_weekly_rent || ''}
                            onChange={this.handleWeeklyRentChange}
                            disabled={this.state.editDisabled}/>
                        </div>
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Rent Payment Frequency</label>
                            <select
                                name="type"
                                className="form-select col-xs-4"
                                disabled={this.state.editDisabled || !this.state.primaryTenant}
                                value={paymentPlanId}
                                onChange={this.handlePaymentPlanChange}>
                                <option value="1">Monthly</option>
                                <option value="2">Fortnightly</option>
                                <option value="3">Weekly</option>
                            </select>
                        </div>
                        {false && <div className="form-group row element main-selection">
                            <label  className="form-label col-xs-6 col-md-4">Has tenant at management start?</label>
                            <div className="paymentRow">
                                <div className="paymentRadio">
                                    <input type="radio"
                                           name="has_tenant_at_management_start"
                                           id="has_tenant_at_management_start"
                                           checked={hasTenantAtManagementStart}
                                           disabled={this.state.editDisabled}
                                           value={1}
                                           onChange={this.handleChangeHasTenantAtStart}
                                           className="property-radio-button paymentRadio__item"
                                    />
                                    <label htmlFor="has_tenant_at_management_start" className="property-radio-value paymentRadio__item">Yes</label>
                                </div>
                                <div className="paymentRadio">
                                    <input type="radio"
                                           name="has_tenant_at_management_start"
                                           id="no_tenant_at_management_start"
                                           checked={!hasTenantAtManagementStart}
                                           disabled={this.state.editDisabled}
                                           value={0}
                                           onChange={this.handleChangeHasTenantAtStart}
                                           className="property-radio-button paymentRadio__item"
                                    />
                                    <label htmlFor="no_tenant_at_management_start" className="property-radio-value paymentRadio__item">No</label>
                                </div>
                            </div>
                        </div>}
                        {this.state.primaryTenant &&
                        <div className="form-group row element main-selection DA-CheckboxItem__checkboxWrap">
                            <label className="left-padded-label">
                                <input disabled={this.state.editDisabled} className="DA-CheckboxItem__checkbox" checked={this.state.primaryTenant[0].holding_deposit}
                                       type="checkbox" id="holdingDeposit" onChange={this.handleOnTick}/>
                                <span className="DA-CheckboxItem__label">Holding Deposit Collected?</span>
                            </label>
                        </div>}
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-4">Bond reference number</label>
                            <input className="form-input currency-input-old"
                                   value={this.state.bond_reference_number}
                                   style={bondRefStyle}
                                   onChange={this.handleChangeBondRefNumber}
                                   disabled={this.state.editDisabled || _.isNull(this.state.primaryTenant)}
                                   type="currency"/>
                        </div>
                        <div className="form-group row element main-selection">
                            {!this.state.editDisabled && (
                                <div className="bottom-buttons force-right">
                                    <button className="save-button" value="Save"
                                            onClick={this.handleFormSubmit}>Save
                                    </button>
                                </div>
                            )}
                            {this.state.editDisabled && (
                                <div className="bottom-buttons force-left">
                                    <button value="edit" className="save-button"
                                            onClick={this.handleEditClick}>Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {this.state.value === 'LEASES' && <Leases propertyId={this.state.propertyId}/>}
                {this.state.value === 'PAYMENT SCHEDULE' && <Schedule/>}
                {this.state.value === 'STATEMENTS' && <Statement/>}
                {this.state.value === 'BILLS' && <Bills propertyId={this.state.propertyId}/>}
            </div>
        );
    }
}