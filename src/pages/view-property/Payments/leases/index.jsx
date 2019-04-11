import React from 'react';
import DatePicker from '../../../../components/elements/DatePicker';
import moment from 'moment';
import DropZone from 'react-dropzone';
import Toastr from 'toastr';
import _ from 'underscore';
import typecast from 'typecast';
import UploadImage from "../../../../assets/images/browse.png";
import ConfirmDialog from '../../../../components/dialogs/confirm.jsx';

import LeaseService from "../../../../services/LeaseService.js";
import DocumentService from "../../../../services/DocumentService.js";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropertyStore from "../../../../stores/PropertyStore.js";
import BlockingActions from "../../../../actions/BlockingActions.js";
import {handleError} from "../../../../utility/helpers.js";
import Optimus from "../../../../utility/optimus.js";
import apiConstants from '../../../../constants/apiConstants';

import './leases.scss';

const MESSAGE = {
    UPCOMING : "- This Lease is upcoming",
    NO_TENANT: "- No tenants are associated to the lease",
    PAYMENT_NOT_STARTED: "- 1st payment debit date has not yet begun",
    EXPIRED: "- Lease is Expired"
};
const DOC_TYPES = apiConstants.TAKE_OVER.DOCUMENT.CATEGORY_ID;

export default class Leases extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasLease: false,
            addLease: false,
            editLease: false,
            activeLease: false,
            selectedType: '',
            rentAmount: null,
            paymentPlanId: '1',
            calculatedRent: 0,
            frequency: 'month',
            leaseStartDate: null,
            leaseEndDate:null,
            leaseEnd: '12',
            firstPayment:null,
            holding_deposit: false,
            autoConvertToPeriodic: true,
            filePreview: null,
            propertyId: PropertyStore.propertyId || props.propertyId,
            isUpcoming: false,
            noTenants: false,
            paymentNotBegun: false,
            leaseDocument: null,
            isConfirmOpen: false,
            isDeleteConfirmOpen: false,
            hasExpired: false,
            tenant: {},
            bondReferenceNumber: '',
            dialogOpen: false
        };
        this.handleAddLeaseButton = this.handleAddLeaseButton.bind(this);
        this.handleFixedTypeSelection = this.handleFixedTypeSelection.bind(this);
        this.handlePeriodicTypeSelection = this.handlePeriodicTypeSelection.bind(this);
        this.handleRentAmountChange = this.handleRentAmountChange.bind(this);
        this.handlePaymentPlanChange = this.handlePaymentPlanChange.bind(this);
        this.calculateRentAmount = this.calculateRentAmount.bind(this);
        this.handleLeaseStartDate = this.handleLeaseStartDate.bind(this);
        this.handleLeaseEndDate = this.handleLeaseEndDate.bind(this);
        this.handleLeaseEndChange = this.handleLeaseEndChange.bind(this);
        this.handleFirstPaymentDate = this.handleFirstPaymentDate.bind(this);
        this.handleOnHoldingTick = this.handleOnHoldingTick.bind(this);
        this.handleConvertToPeriodicTick = this.handleConvertToPeriodicTick.bind(this);
        this.onDropFiles = this.onDropFiles.bind(this);
        this.onAddNewLease = this.onAddNewLease.bind(this);
        this.onAddNewLeaseCancel = this.onAddNewLeaseCancel.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.fetchLease = this.fetchLease.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.confirmLeaseDelete = this.confirmLeaseDelete.bind(this);
        this.onEditLease = this.onEditLease.bind(this);
        this.onEditLeaseCancel = this.onEditLeaseCancel.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.handleChangeBondRefNumber = this.handleChangeBondRefNumber.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
    }

    componentDidMount() {
        this.fetchLease();
    }

    fetchLease() {
        BlockingActions.block();
        let self = this;
        LeaseService.getLease(self.state.propertyId)
            .then(function (leases) {
                if(leases.data.length > 0) {
                    let availableLease = leases.data[0];
                    let leaseStartDate = !_.isNull(availableLease.lease_start_date) ? new Date(availableLease.lease_start_date) : null;
                    let leaseEndDate = !_.isNull(availableLease.lease_end_date) ? new Date(availableLease.lease_end_date) : null;
                    let firstPayment = !_.isNull(availableLease.rent_paid_until_date) ? new Date(availableLease.rent_paid_until_date) : null;
                    let frequency = 'month';
                    switch(availableLease.payment_plan_id.toString())  {
                        case '1':
                            frequency = 'month';
                            break;
                        case '2':
                            frequency = 'fortnight';
                            break;
                        case '3':
                            frequency = 'week';
                            break;
                    }
                    self.setState({
                        hasLease: true,
                        addLease: false,
                        id: availableLease.id,
                        leaseStartDate: leaseStartDate,
                        leaseEndDate: leaseEndDate,
                        firstPayment: firstPayment,
                        holding_deposit: availableLease.holding_deposit,
                        autoConvertToPeriodic: !_.isNull(availableLease.is_convertible_to_periodic) ? availableLease.is_convertible_to_periodic : null,
                        selectedType: availableLease.lease_type === 1 ? 'periodic' : 'fixed',
                        rentAmount: availableLease.Property.current_weekly_rent,
                        isUpcoming: availableLease.leaseState === 1,
                        paymentNotBegun: firstPayment ? moment().isBefore(moment(availableLease.rent_paid_until_date)) : true,
                        noTenants: _.isNull(availableLease.user_id),
                        hasExpired: moment().isAfter(moment(availableLease.lease_end_date)),
                        paymentPlanId: availableLease.payment_plan_id.toString(),
                        frequency: frequency,
                        tenant: availableLease.User,
                        bondReferenceNumber: availableLease.bond_reference_number
                    }, self.calculateRentAmount);
                }
                BlockingActions.unblock();
            })
            .catch(console.log);
    }

    handleChangeBondRefNumber(e) {
        let value = e.target.value;
        let isAllowed = !(value.match(/[^0-9|a-z|A-Z|-]/));
        if (typecast(value, 'string').indexOf(' ') > -1) { // has spaces
            isAllowed = false;
        }
        if (isAllowed) {
            this.setState({
                bondReferenceNumber: value
            });
        }
    }

    handleDialogOpen() {
        this.setState({
            dialogOpen: true
        })
    }

    confirmLeaseDelete(){
        BlockingActions.block();
        LeaseService.deleteLease(this.state.id)
            .then(response => {
                Toastr.success(response.status.message);
                this.setState({
                    hasLease: false,
                    addLease: false
                } ,this.fetchLease);
                BlockingActions.unblock();
            })
            .catch(error => {
                Toastr.error(JSON.parse(error.response).status.message);
                BlockingActions.unblock();
            });
    }

    handleDialogClose() {
        this.setState({
            dialogOpen: false
        })
    }

    handleAddLeaseButton() {
        this.setState({
            addLease: true
        })
    }

    handleFixedTypeSelection() {
        this.setState({
            selectedType: 'fixed'
        })
    }

    handlePeriodicTypeSelection() {
        this.setState({
            selectedType: 'periodic',
            leaseEndDate: null
        })
    }

    handleRentAmountChange(e) {
        this.setState({
            rentAmount: e.target.value
        }, () => {
            this.calculateRentAmount();
        })
    }

    handlePaymentPlanChange(e) {
        let frequency = '';
        switch(e.target.value) {
            case '1':
                frequency = 'month';
                break;
            case '2':
                frequency = 'fortnight';
                break;
            case '3':
                frequency = 'week';
                break;
        }
        this.setState({
            paymentPlanId: e.target.value,
            frequency: frequency
        }, this.calculateRentAmount)
    }

    calculateRentAmount() {
        let amount = 0;
        let rent = this.state.rentAmount ? this.state.rentAmount : 0;
        BlockingActions.block();
        switch(this.state.paymentPlanId) {
            case '1':
                amount = ((rent/7)*365)/12;
                break;
            case '2':
                amount = rent*2;
                break;
            case '3':
                amount = rent*1;
                break;
        }
        let activeLease = !(this.state.isUpcoming || this.state.noTenants || this.state.paymentNotBegun || (this.state.hasExpired && this.state.selectedType === 'fixed'));

        this.setState({
            calculatedRent: amount.toFixed(2),
            activeLease: activeLease
        }, BlockingActions.unblock)
    }

    handleLeaseStartDate(e, date) {
        this.setState({
            leaseStartDate: e._d,
            leaseEndDate: this.getLeaseEndDate(e._d)
        })
    }

    getLeaseEndDate(date) {
        if(this.state.selectedType === 'periodic') {
            return null;
        }
        return moment(date).add(this.state.leaseEnd, 'months').subtract(1, "days")._d;
    }

    handleLeaseEndChange(e) {
        let leaseEndDate = null;
        if(this.state.leaseStartDate) {
            leaseEndDate = moment(this.state.leaseStartDate).add(e.target.value, 'months').subtract(1, "days");
        }
        this.setState({
            leaseEnd: e.target.value,
            leaseEndDate: leaseEndDate._d
        })
    }

    handleLeaseEndDate(e, date) {
        this.setState({
            leaseEndDate: date
        })
    }

    handleFirstPaymentDate(e, date) {
        this.setState({
            firstPayment: e._d
        })
    }

    handleOnHoldingTick(e) {
        this.setState({
            holding_deposit: e.target.checked
        })
    }

    handleConvertToPeriodicTick(e) {
        this.setState({
            autoConvertToPeriodic: e.target.checked
        })
    }

    onDropFiles(file) {
        this.setState({
            filePreview: file[0].preview,
            leaseDocument: file[0]
        })
    }

    onAddNewLease() {

        if(this.state.selectedType === '') {
            Toastr.error("Please Select a Lease Type");
        } else if((_.isNull(this.state.leaseStartDate) || _.isNull(this.state.firstPayment) ) ||
            _.isNull(this.state.rentAmount) || this.state.rentAmount < 1 ||
            (_.isNull(this.state.leaseEndDate) && this.state.selectedType === 'fixed')) {
            if(_.isNull(this.state.leaseEndDate) && this.state.selectedType === 'fixed') {
                Toastr.error("Please Enter a Lease End Date");
            } else if(_.isNull(this.state.leaseStartDate)) {
                Toastr.error("Please enter Lease Start date.");
            } else if(_.isNull(this.state.firstPayment)) {
                Toastr.error("Please enter First Payment debit date.");
            } else if(_.isNull(this.state.rentAmount) || this.state.rentAmount < 1) {
                Toastr.error("Please Enter Weekly rent amount.");
            }

        } else if (this.state.selectedType === 'fixed' && moment(this.state.leaseEndDate).isBefore(moment())) {
            Toastr.error("Please Enter a Future date as Lease End Date");
        } else{
            BlockingActions.block();
            let lease = {};
            lease.current_weekly_rent = this.state.rentAmount;
            lease.lease_start_date = moment(this.state.leaseStartDate).format("YYYY-MM-DD");
            if (!_.isNull(this.state.leaseEndDate) && !_.isUndefined(this.state.leaseEndDate)) {
                lease.lease_end_date = moment(this.state.leaseEndDate).format("YYYY-MM-DD");
            }
            lease.first_payment_date = moment(this.state.firstPayment).format("YYYY-MM-DD");
            lease.payment_plan_id = this.state.paymentPlanId;
            lease.holding_deposit = this.state.holding_deposit;
            lease.convertibleStatus = this.state.autoConvertToPeriodic ? 1 : 0;
            lease.lease_type = this.state.selectedType === 'periodic' ? 1 : 0;
            lease.bond_reference_number = this.state.bondReferenceNumber;
            let data = {
                category_id: DOC_TYPES.LEASE_AGREEMENT.ID,
                property_id: PropertyStore.propertyId,
                file: this.state.leaseDocument
            };

            if (this.state.selectedType === 'periodic') {
                delete lease.lease_end_date;
                delete lease.convertibleStatus;
            }

            LeaseService.addLease(PropertyStore.propertyId, lease)
                .then(response => {
                    Toastr.success(response.status.message);
                    this.setState({
                        hasLease: true,
                        addLease: false,
                        editLease: false,
                        activeLease: false
                    } ,this.fetchLease);
                })
                .then(() => {
                    DocumentService.addDocument(data, 'POST')
                        .then(response => {
                            Toastr.success(response.status.message);
                            BlockingActions.unblock();
                        })
                })
                .catch(error => {
                    this.setState({
                        hasLease: true,
                        addLease: false,
                        editLease: false,
                        activeLease: false
                    } ,this.fetchLease);
                    BlockingActions.unblock();
                });
        }

    }

    onAddNewLeaseCancel() {
        this.setState({
            selectedType: '',
            rentAmount: null,
            paymentPlanId: '1',
            calculatedRent: 0,
            frequency: 'month',
            leaseStartDate: null,
            leaseEndDate: null,
            leaseEnd: '12',
            firstPayment: null,
            holding_deposit: false,
            autoConvertToPeriodic: false,
            filePreview: null
        });
    }

    onEditLease() {
        if(this.state.selectedType === '') {
            Toastr.error("Please Select a Lease Type");
        } else if((_.isNull(this.state.leaseStartDate) || _.isNull(this.state.firstPayment)) ||
            _.isNull(this.state.rentAmount) || this.state.rentAmount < 1 ||
            (_.isNull(this.state.leaseEndDate) && this.state.selectedType === 'fixed')) {
            if(_.isNull(this.state.leaseEndDate) && this.state.selectedType === 'fixed') {
                Toastr.error("Please Enter a Lease End Date");
            } else if(_.isNull(this.state.leaseStartDate)) {
                Toastr.error("Please enter Lease Start date.");
            } else if(_.isNull(this.state.firstPayment)) {
                Toastr.error("Please enter First Payment debit date.");
            } else if(_.isNull(this.state.rentAmount) || this.state.rentAmount < 1) {
                Toastr.error("Please Enter Weekly rent amount.");
            }

        } else if (this.state.selectedType === 'fixed' && moment(this.state.leaseEndDate).isBefore(moment())) {
            Toastr.error("Please Enter a Future date as Lease End Date");
        } else {
            BlockingActions.block();
            let lease = {};
            lease.current_weekly_rent = this.state.rentAmount;
            if (!_.isNull(this.state.leaseStartDate) && !_.isUndefined(this.state.leaseStartDate)) {
                lease.lease_start_date = moment(this.state.leaseStartDate).format("YYYY-MM-DD");
            }
            if (!_.isNull(this.state.firstPayment) && !_.isUndefined(this.state.firstPayment)) {
                lease.first_payment_date = moment(this.state.firstPayment).format("YYYY-MM-DD");
            }
            if (!_.isNull(this.state.leaseEndDate) && !_.isUndefined(this.state.leaseEndDate)) {
                lease.lease_end_date = moment(this.state.leaseEndDate).format("YYYY-MM-DD");
            }
            lease.payment_plan_id = this.state.paymentPlanId;
            lease.holding_deposit = Boolean(this.state.holding_deposit);
            lease.convertibleStatus = this.state.autoConvertToPeriodic ? 1 : 0;
            lease.lease_type = this.state.selectedType === 'periodic' ? 1 : 0;
            lease.leaseId = this.state.id;
            lease.bond_reference_number = this.state.bondReferenceNumber;
            if (this.state.selectedType === 'periodic') {
                delete lease.lease_end_date;
                delete lease.convertibleStatus;
            }

            LeaseService.updateLease(lease, PropertyStore.propertyId)
                .then(response => {
                    Toastr.success(response.status.message);
                    this.setState({
                        hasLease: true,
                        addLease: false,
                        editLease: false
                    } ,this.fetchLease);
                    BlockingActions.unblock();
                })
                .catch(error => {
                    handleError(error);
                    BlockingActions.unblock();
                });
        }
    }

    onDeleteClick(){
        this.setState({
            isDeleteConfirmOpen: true
        });
    }

    onEditLeaseCancel(){
        this.setState({
            editLease: false
        },this.fetchLease)
    }

    onEditClick() {
        this.setState({
            editLease: true
        })
    }

    confirmDelete(e) {
        e.stopPropagation();
        this.setState({
            isConfirmOpen: true
        });
    }

    closeConfirm() {
        this.setState({
            isConfirmOpen: false,
            isDeleteConfirmOpen: false
        });
    }

    removeFile() {
        this.setState({
            filePreview: null
        });
        this.closeConfirm();
    }

    viewPersonPage() {
        window.location.href='/#/view-person/' + Optimus.encode(this.state.tenant.id)+ '/tenant';
    }

    render() {
        let dropZoneStyle = {
            "width": "251px",
            "borderRadius": "8px",
            "border": "1px dashed #000000",
            "opacity": 0.2,
            "marginTop": "10px",
            "cursor": "pointer"
        };
        let accept = {
            borderColor: '#2de8ae'
        };
        let bondRefStyle = {
            width: '250px',
            marginLeft: '7px',
            paddingLeft: '10px'
        };
        let bondRefStyleNotPadding = {
            width: '250px',
            marginLeft: '7px',
        };
        const confirmLabels = {
            yes: 'Delete',
            no: 'Cancel'
        };
        const datePickerInputStyles = {
            'marginLeft': '-7px',
            'width': '250px'
        };

        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                onClick={this.handleDialogClose}
            />
        ];

    var leaseEnd = this.state.leaseEnd;

    if(this.state.leaseEndDate){
        let duration = moment(this.state.leaseEndDate).add(1, "days").diff(moment(this.state.leaseStartDate), 'months');
        let durationArray = [3,6,9,12,24,36,60];
        leaseEnd = durationArray.includes(duration)? duration: 0;
    }

        return (



            <div className="leases-section">
                {!this.state.hasLease && !this.state.addLease && <div>
                    <div className="leases-header-section"> There is no lease on this property</div>
                    <div className="add-lease-button" onClick={this.handleAddLeaseButton}>ADD LEASE</div>
                </div>}
                {this.state.addLease && <div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">
                                Type
                            </div>
                        </div>
                        <div className="col-md-3">
                            <input type="radio" id="test1" name="radio-type" value="fixed" onChange={this.handleFixedTypeSelection} checked={this.state.selectedType === 'fixed'}/>
                                <label htmlFor="test1">Fixed</label>
                            <input type="radio" id="test2" name="radio-type" value="periodic" onChange={this.handlePeriodicTypeSelection} checked={this.state.selectedType === 'periodic'}/>
                                <label htmlFor="test2">Periodic</label>
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Weekly Rent Amount</div>
                        </div>
                        <div className="col-md-3">
                            <input type="number" className="lease-weekly-rent" min={0} value={this.state.rentAmount ? this.state.rentAmount : ''} onChange={this.handleRentAmountChange}/>
                            <div className="rent-prefix">$</div>
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Rent Payment Frequency</div>
                        </div>
                        <div className="col-md-3">
                            <select
                                name="type"
                                value={this.state.paymentPlanId}
                                onChange={this.handlePaymentPlanChange}>
                                <option value="1">Monthly</option>
                                <option value="2">Fortnightly</option>
                                <option value="3">Weekly</option>
                            </select>
                        </div>
                    </div>
                    {this.state.calculatedRent > 0 &&
                    <div>
                    <div className="lease-row row">
                        <div className="col-md-9 col-md-offset-3">
                            <div className="calculated-rent-message">Rent payments will be ${this.state.calculatedRent} due every {this.state.frequency}</div>
                        </div>
                    </div>
                    <div className="lease-row row"/>
                    </div>
                    }
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Lease Start Date</div>
                        </div>
                        <div className="col-md-3">
                            <DatePicker
                                value={this.state.leaseStartDate}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleLeaseStartDate}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className={this.state.selectedType === 'periodic' ? 'lease-row row hide-lease-end' : 'lease-row row'}>
                        <div className="col-md-3">
                            <div className="lease-row-label">Lease End Date</div>
                        </div>
                        <div className="col-md-2">
                            <select
                                disabled={this.state.selectedType === 'periodic' || _.isNull(this.state.leaseStartDate)}
                                name="type"
                                value={leaseEnd}
                                onChange={this.handleLeaseEndChange}>
                                <option value=""/>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="9">9 Months</option>
                                <option value="12">1 Year</option>
                                <option value="24">2 Year</option>
                                <option value="36">3 Year</option>
                                <option value="60">5 Year</option>
                                <option value="0">Other</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <div className="lease-end-or-label">or</div>
                        </div>
                        <div className="col-md-3">
                            <DatePicker
                                value={this.state.leaseEndDate}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleLeaseEndDate}
                                disabled={this.state.selectedType === 'periodic' || _.isNull(this.state.leaseStartDate)}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">1st Payment Debit Date</div>
                        </div>
                        <div className="col-md-3">
                            <DatePicker
                                value={this.state.firstPayment}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleFirstPaymentDate}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Holding Deposit Collected?</div>
                        </div>
                        <div className="col-md-3">
                            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                                <div className="DA-CheckboxItem__checkboxWrap">
                                    <label><input className="DA-CheckboxItem__checkbox" checked={this.state.holding_deposit}
                                                  type="checkbox" id="holdingDeposit" onChange={this.handleOnHoldingTick}/>
                                        <span className="DA-CheckboxItem__label TOItem"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.selectedType === 'fixed' &&<div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Automatically Convert to Periodic?</div>
                        </div>
                        <div className="col-md-3">
                            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                                <div className="DA-CheckboxItem__checkboxWrap">
                                    <label><input className="DA-CheckboxItem__checkbox" checked={this.state.autoConvertToPeriodic}
                                                  type="checkbox" id="autoConvert" onChange={this.handleConvertToPeriodicTick}/>
                                        <span className="DA-CheckboxItem__label TOItem"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="form-group row element main-selection">
                        <label className="form-label col-xs-6 col-md-3">Bond reference number</label>
                        <input className="form-input currency-input-old"
                               value={this.state.bondReferenceNumber}
                               style={bondRefStyle}
                               onChange={this.handleChangeBondRefNumber}
                               type="currency"/>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Lease Document</div>
                        </div>
                        <div className="col-md-3">
                            <ConfirmDialog
                                labels={confirmLabels}
                                title={"Deleting Lease document"}
                                message={"Are you sure you want to delete Lease Document?"}
                                isOpen={this.state.isConfirmOpen}
                                close={this.closeConfirm}
                                confirmAction={this.removeFile}/>
                            <DropZone
                                acceptStyle={accept}
                                accept="application/pdf, image/*"
                                style={dropZoneStyle}
                                className="drop-zone-body-content"
                                disabled={!_.isNull(this.state.filePreview)}
                                onDrop={this.onDropFiles}>
                                {_.isNull(this.state.filePreview) && <div>
                                    <img src={UploadImage}/>
                                    <div className="drop-zone-text">Drag & drop, or <span>browse.</span></div>
                                </div>}
                                {!_.isNull(this.state.filePreview) && <div onClick={this.confirmDelete} className="submitted-content">
                                    <div className="DA-Uploader__clear"></div>
                                    <img src={UploadImage}/>
                                    <div className="drop-zone-text">{this.state.leaseDocument.name}</div>
                                </div>}
                            </DropZone>
                        </div>
                    </div>
                    <div className="lease-row row"/>
                    <div className="lease-row row"/>
                    <div className="lease-row row action-buttons">
                        <button type="submit" className="button button_main" onClick={this.onAddNewLease}>SAVE</button>
                        <button type="reset" className="button" onClick={this.onAddNewLeaseCancel}>CANCEL</button>
                    </div>
                </div>}
                {!this.state.addLease && !this.state.activeLease && this.state.editLease && <div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">
                                Type
                            </div>
                        </div>
                        <div className="col-md-3">
                            <input type="radio" id="test1" name="radio-type" value="fixed" onChange={this.handleFixedTypeSelection} checked={this.state.selectedType === 'fixed'}/>
                            <label htmlFor="test1">Fixed</label>
                            <input type="radio" id="test2" name="radio-type" value="periodic" onChange={this.handlePeriodicTypeSelection} checked={this.state.selectedType === 'periodic'}/>
                            <label htmlFor="test2">Periodic</label>
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Weekly Rent Amount</div>
                        </div>
                        <div className="col-md-3">
                            <input type="number" className="lease-weekly-rent" min={0} value={this.state.rentAmount ? this.state.rentAmount : ''} onChange={this.handleRentAmountChange}/>
                            <div className="rent-prefix">$</div>
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Rent Payment Frequency</div>
                        </div>
                        <div className="col-md-3">
                            <select
                                name="type"
                                value={this.state.paymentPlanId}
                                onChange={this.handlePaymentPlanChange}>
                                <option value="1">Monthly</option>
                                <option value="2">Fortnightly</option>
                                <option value="3">Weekly</option>
                            </select>
                        </div>
                    </div>
                    {this.state.calculatedRent > 0 &&
                    <div>
                        <div className="lease-row row">
                            <div className="col-md-9 col-md-offset-3">
                                <div className="calculated-rent-message">Rent payments will be ${this.state.calculatedRent} due every {this.state.frequency}</div>
                            </div>
                        </div>
                        <div className="lease-row row"/>
                    </div>
                    }
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Lease Start Date</div>
                        </div>
                        <div className="col-md-3">
                            <DatePicker
                                value={this.state.leaseStartDate}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleLeaseStartDate}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Lease End Date</div>
                        </div>
                        <div className="col-md-2">
                            <select
                                disabled={this.state.selectedType === 'periodic' || _.isNull(this.state.leaseStartDate)}
                                name="type"
                                value={leaseEnd}
                                onChange={this.handleLeaseEndChange}>
                                <option value=""/>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="9">9 Months</option>
                                <option value="12">1 Year</option>
                                <option value="24">2 Year</option>
                                <option value="36">3 Year</option>
                                <option value="60">5 Year</option>
                                <option value="0">Other</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <div className="lease-end-or-label">or</div>
                        </div>
                        <div className="col-md-3">
                             <DatePicker
                                value={this.state.leaseEndDate}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleLeaseEndDate}
                                disabled={this.state.selectedType === 'periodic' || _.isNull(this.state.leaseStartDate)}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">1st Payment Debit Date</div>
                        </div>
                        <div className="col-md-3">
                            <DatePicker
                                value={this.state.firstPayment}
                                format='MMMM DD, YYYY'
                                onChangeDate={this.handleFirstPaymentDate}
                                inputStyle={datePickerInputStyles}
                             />
                        </div>
                    </div>
                    <div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Holding Deposit Collected?</div>
                        </div>
                        <div className="col-md-3">
                            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                                <div className="DA-CheckboxItem__checkboxWrap">
                                    <label><input className="DA-CheckboxItem__checkbox" checked={this.state.holding_deposit}
                                                  type="checkbox" id="holdingDeposit" onChange={this.handleOnHoldingTick}/>
                                        <span className="DA-CheckboxItem__label TOItem"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.selectedType === 'fixed' &&<div className="lease-row row">
                        <div className="col-md-3">
                            <div className="lease-row-label">Automatically Convert to Periodic?</div>
                        </div>
                        <div className="col-md-3">
                            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                                <div className="DA-CheckboxItem__checkboxWrap">
                                    <label><input className="DA-CheckboxItem__checkbox" checked={this.state.autoConvertToPeriodic}
                                                  type="checkbox" id="autoConvert" onChange={this.handleConvertToPeriodicTick}/>
                                        <span className="DA-CheckboxItem__label TOItem"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="form-group row element main-selection">
                        <label className="form-label col-xs-6 col-md-3">Bond reference number</label>
                        <input className="form-input currency-input-old"
                               value={this.state.bondReferenceNumber}
                               style={bondRefStyle}
                               onChange={this.handleChangeBondRefNumber}
                               type="currency"/>
                    </div>
                    <div className="lease-row row"/>
                    <div className="lease-row row"/>
                    <div className="lease-row row action-buttons">
                        <button type="submit" className="button button_main" onClick={this.onEditLease}>SAVE</button>
                        <button type="reset" className="button" onClick={this.onEditLeaseCancel}>CANCEL</button>
                    </div>
                </div>}
                {this.state.hasLease && ((this.state.editLease && this.state.activeLease) || !this.state.editLease) && !this.state.addLease && <div>
                    {this.state.activeLease && <div>
                        <div className="leases-header-section-has">This lease is active</div>
                        {this.state.tenant.name && <div className="status-sub-header-text">Active tenants: <a onClick={() => this.viewPersonPage()}>{this.state.tenant.name}</a> </div>}
                        <div className="row actcive-lease-action-buttons">
                            <div className="add-lease-button" onClick={this.handleDialogOpen}>ADJUST PAYMENT SCHEDULE</div>
                            <div className="add-lease-button" onClick={this.handleDialogOpen}>RENEW LEASE</div>
                            <div className="add-lease-button" onClick={this.handleDialogOpen}>END LEASE</div>
                        </div>
                        <Dialog
                            title="Coming Soon"
                            actions={actions}
                            modal={true}
                            open={this.state.dialogOpen}
                        >
                            This Component is coming soon!.
                        </Dialog>
                    </div>}
                    {!this.state.activeLease && <div>
                        <div className="leases-header-section-has-inactive">This lease is inactive</div>
                        {this.state.isUpcoming && <div className="status-sub-header-text">{MESSAGE.UPCOMING}</div>}
                        {this.state.noTenants && <div className="status-sub-header-text">{MESSAGE.NO_TENANT}</div>}
                        {this.state.paymentNotBegun && <div className="status-sub-header-text">{MESSAGE.PAYMENT_NOT_STARTED}</div>}
                        {this.state.hasExpired && <div className="status-sub-header-text">{MESSAGE.EXPIRED}</div>}
                    </div>}
                    <div className="lease-detail-section">
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Type
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.selectedType}
                                </div>
                            </div>
                        </div>
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Weekly Rent Amount
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    ${this.state.rentAmount}
                                </div>
                            </div>
                        </div>
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Rent Payment Frequency
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.frequency}ly
                                </div>
                            </div>
                        </div>
                        {this.state.calculatedRent > 0 &&
                        <div>
                            <div className="lease-row row">
                                <div className="col-md-9 col-md-offset-3">
                                    <div className="calculated-rent-message">Rent payments will be ${this.state.calculatedRent} due every {this.state.frequency}</div>
                                </div>
                            </div>
                            <div className="lease-row row" />
                        </div>
                        }
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Lease Start Date
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.leaseStartDate ? moment(this.state.leaseStartDate).format("MMMM DD, YYYY") : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Lease End Date
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.leaseEndDate && this.state.selectedType === 'fixed'
                                        ? moment(this.state.leaseEndDate).format("MMMM DD, YYYY") : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    1st Payment Debit Date
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.firstPayment ? moment(this.state.firstPayment).format("MMMM DD, YYYY") : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Holding Deposit Collected?
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.holding_deposit ? "Yes" : "No"}
                                </div>
                            </div>
                        </div>
                        {this.state.selectedType === 'fixed' &&<div className="lease-row row">
                            <div className="col-md-3">
                                <div className="lease-row-label">
                                    Automatically Convert to Periodic?
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="lease-fields">
                                    {this.state.autoConvertToPeriodic ? "Yes" : "No"}
                                </div>
                            </div>
                        </div>}
                        <div className="form-group row element main-selection">
                            <label className="form-label col-xs-6 col-md-3">Bond reference number</label>
                        { !this.state.editLease &&
                        <input className="form-input currency-input-old"
                            value={this.state.bondReferenceNumber}
                            style={bondRefStyleNotPadding}
                            onChange={this.handleChangeBondRefNumber}
                            disabled={true}
                            type="currency"/>
                        }
                        { this.state.editLease &&
                        <input className="form-input currency-input-old"
                            value={this.state.bondReferenceNumber}
                            style={bondRefStyle}
                            onChange={this.handleChangeBondRefNumber}
                            type="currency"/>
                        }
                        </div>
                        <div className="lease-row row"/>
                        <div className="lease-row row action-buttons">

                        {this.state.editLease &&  <div>
                            <button type="submit" className="button button_main" onClick={this.onEditLease}>SAVE</button>
                            <button type="reset" className="button" onClick={this.onEditLeaseCancel}>CANCEL</button>
                        </div>
                        }
                        {!this.state.hasExpired && !this.state.activeLease && <button type="reset" className="button" onClick={this.onDeleteClick}>DELETE</button>}
                        {!this.state.hasExpired && !this.state.editLease && <button type="submit" className="button button_main" onClick={this.onEditClick}>EDIT</button>}
                        <ConfirmDialog
                            labels={confirmLabels}
                            title={"Deleting Lease "}
                            message={"Are you sure you want to delete this Lease?"}
                            isOpen={this.state.isDeleteConfirmOpen}
                            close={this.closeConfirm}
                            confirmAction={this.confirmLeaseDelete}/>
                        </div>
                    </div>
                </div>}

            </div>
        );
    }
}
