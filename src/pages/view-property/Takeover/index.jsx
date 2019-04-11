import React from 'react';
import typecast from 'typecast';
import _ from 'underscore';
import only from 'only';
import './takeover.scss';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Uploader from './uploader.jsx'
import OptimalHash from '../../../utility/optimus';
import UiService from '../../../services/UiService';
import TakeoverService from '../../../services/TakeoverService';
import TakeoverStore from '../../../stores/TakeoverStore';
import PropertyStore from '../../../stores/PropertyStore';
import apiConstants from '../../../constants/apiConstants';
import PropertyService from '../../../services/PropertiesServices';
import Moment from 'moment';
import ErrorMessage from '../../../components/validation/error-message.jsx';
const CHECKLIST = apiConstants.TAKE_OVER.CONFIRM;
import {cloneObject} from '../../../utility/helpers';
const DOC_TYPES = apiConstants.TAKE_OVER.DOCUMENT.CATEGORY_ID;

const Percentage = (props)=> {
    let className = "TOTitle__percent";
    if (props.value > 0) {
        className = "TOTitle__percent TOTitle__percent--progress";
    }
    if (props.value === 100) {
        className = "TOTitle__percent TOTitle__percent--done";
    }

    return (
        <span className={className}>{props.value}%</span>
    )
}

export default class Takeover extends React.Component {
    constructor(props) {
        super(props);
        this._mount = false;
        this.state = {
            info: '',
            propertyId: OptimalHash.decode(this.props.params.id),
            property_address: '',
            takeoverError: false,
            takeoverErrorMessage: '',
            dataLoaded: false,
            checkList: null,
            testing: false,
            devCompleted: true,
            editBondRef: false,
            emailsSent: [],
            tenantInspection: {
                inspection_date: '',
                inspection_time: ''
            },
            editTenantInspection: false,
            tenantInspectionValidation: {
                isValid: true,
                message: ''
            },
            percentage: 0
        };

        this.updateFromStore = this.updateFromStore.bind(this);
        this.renderTenantAtProperty = this.renderTenantAtProperty.bind(this);
        this.renderPrpoertyMe = this.renderPrpoertyMe.bind(this);
        this.renderBondReference = this.renderBondReference.bind(this);
        this.renderRecurringBills = this.renderRecurringBills.bind(this);
        this.renderSendTitle = this.renderSendTitle.bind(this);
        this.changeListValue = this.changeListValue.bind(this);
        this.updateTestData = this.updateTestData.bind(this);
        this.handleSubmitBondReference = this.handleSubmitBondReference.bind(this);
        this.handleChangeBondReference = this.handleChangeBondReference.bind(this);
        this.editBondReference = this.editBondReference.bind(this);
        this.renderKeyDocuments = this.renderKeyDocuments.bind(this);
        this.renderBondTransfer = this.renderBondTransfer.bind(this);
        this.renderAddTenant = this.renderAddTenant.bind(this);
        this.fetchProperty = this.fetchProperty.bind(this);
        this.updateMailListFromStore = this.updateMailListFromStore.bind(this);
        this.renderConfirmManagementStart = this.renderConfirmManagementStart.bind(this);
        this.renderTenantInspection = this.renderTenantInspection.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.setTenantInspectionDate = this.setTenantInspectionDate.bind(this);
        this.setTenantInspectionTime = this.setTenantInspectionTime.bind(this);
        this.handleClickAddTenantInspection = this.handleClickAddTenantInspection.bind(this);
        this.handleClickUpdateTenantInspection = this.handleClickUpdateTenantInspection.bind(this);
        this.validateTenantInspection = this.validateTenantInspection.bind(this);
        this.resetValidation = this.resetValidation.bind(this);
        this.handleClickDatePicker = this.handleClickDatePicker.bind(this);
        this.handleClickTimePicker = this.handleClickTimePicker.bind(this);
        this.updatePercentage = this.updatePercentage.bind(this);
    }

    componentDidMount() {
        scroll(0, 0);
        this._mount = true;
        UiService.changePropertyTab({
            activeTab: 'Takeover'
        });
        let self = this;
        if (!_.isUndefined(this.state.propertyId)) {
            this.fetchProperty();
        }
        if (this.state.testing === false) {
            TakeoverService.fetchTakeoverInfo(this.state.propertyId);
            TakeoverStore.on('change', this.updateFromStore);
            TakeoverStore.on('mailsUpdated', this.updateMailListFromStore);
            PropertyStore.on('change', this.updateFromStore);
            TakeoverStore.on('percentageChanged', this.updatePercentage);

        } else {
            this.updateTestData();
        }
    }

    handleClickDatePicker() {
        const { editTenantInspection, checkList } = this.state;
        const { schedule_tenant_inspection } = checkList;
        if(!schedule_tenant_inspection && editTenantInspection) {
            this.datePicker.focus();
        }
    }

    handleClickTimePicker() {
        const { editTenantInspection, checkList } = this.state;
        const { schedule_tenant_inspection } = checkList;
        if(!schedule_tenant_inspection && editTenantInspection) {
            this.timePicker.focus();
        }
    }

    updatePercentage() {
        this.setState({
            percentage: TakeoverStore.percentage
        });
    }

    fetchProperty() {
        PropertyService.findProperty(this.state.propertyId)
            .then((res) => {
                if(!_.isUndefined(res.status.data.addr_street_address) && self._mount){
                    this.setState({
                        property_address: res.status.data.addr_street_address
                    });
                }
            });
    }

    editTenantInspection(value) {
        this.setState({
            editTenantInspection: value
        });
    }

    validateTenantInspection() {
        let tenantInspectionValidation = _.clone(this.state.tenantInspectionValidation);
        let isValid = true;
        let message = '';
        if (_.isEmpty(this.state.tenantInspection.inspection_date)) {
            isValid = false;
            message = 'Please select an inspection date';
        }
        if (_.isEmpty(this.state.tenantInspection.inspection_time)) {
            if (isValid === true) {
                message = 'Please select an inspection time';
            } else {
                message = 'Please select an inspection date and time';
            }
            isValid = false;
        }
        if (isValid === false) {

            tenantInspectionValidation.isValid = false;
            tenantInspectionValidation.message = message;

            this.setState({
                tenantInspectionValidation
            });
        }

        console.log(tenantInspectionValidation);
        return isValid;
    }

    resetValidation() {
        let tenantInspectionValidation = _.clone(this.state.tenantInspectionValidation);
        tenantInspectionValidation.isValid = true;
        this.setState({
            tenantInspectionValidation
        });
    }

    handleClickAddTenantInspection() {
        let isValid = this.validateTenantInspection();
        if (isValid === false) {
            return;
        }
        let inspection = _.clone(this.state.tenantInspection);
        delete inspection.tenant_inspection_id;
        if (!_.isUndefined(this.state.info.lease_id)) {
            inspection.lease_id = this.state.info.lease_id;
        }

        TakeoverService.updateTenantInspection(inspection);
    }

    handleClickUpdateTenantInspection() {
        let inspection = _.clone(this.state.tenantInspection);
        if (!_.isUndefined(this.state.info.tenant_inspection_id)) {
            inspection.tenant_inspection_id = this.state.info.tenant_inspection_id;
        }
        inspection.options = {
            update: true
        };

        TakeoverService.updateTenantInspection(inspection)
            .then((res) => {
                this.editTenantInspection(false);
            });
    }
    setTenantInspectionDate(value) {
        let tenantInspection = _.clone(this.state.tenantInspection);
        tenantInspection.inspection_date = value;
        this.setState({
            tenantInspection
        });
    }

    setTenantInspectionTime(value) {
        let tenantInspection = _.clone(this.state.tenantInspection);
        tenantInspection.inspection_time = value;
        this.setState({
            tenantInspection
        });
    }

    componentWillUnmount() {
        this._mount = false;
        TakeoverStore.removeListener('change', this.updateFromStore);
        TakeoverStore.removeListener('mailsUpdated', this.updateMailListFromStore);
        PropertyStore.removeListener('change', this.updateFromStore);
        TakeoverStore.removeListener('percentageChanged', this.updatePercentage);
    }

    updateTestData() {
        this.setState({
            dataLoaded: true,
            checkList: {
                "confirm_has_tenant_at_management_start": 1,
                "confirm_management_start_date": 1,
                "send_tile": 1,
                "add_bond_transfer_document": 2,
                "add_tenant": 2,
                "schedule_tenant_inspection": 2,
                "add_lease": 1,
                "setup_recurring_bills": 1,
                "add_key_documents": 2,
                "add_to_property_me": 1,
                "confirm_bond_reference_number": 1
            }
        });
    }

    componentWillUpdate(nextProps, nextState) {
        const propertyId = OptimalHash.decode(nextProps.params.id);
        if (this.props.params.id !== nextProps.params.id) {
            this.setState({
                propertyId: propertyId
            }, () => {
                PropertyService.findProperty(propertyId);
                TakeoverService.fetchTakeoverInfo(propertyId);
            });
        }
    }

    updateMailListFromStore() {
        if(TakeoverStore.hasError === true) {
            this.setState({
                takeoverError: true,
                takeoverErrorMessage: TakeoverStore.errorMessage
            });
        } else {
            this.setState({
                emailsSent: TakeoverStore.emailsSent
            });
        }
    }

    updateFromStore() {
        if (!_.isNull(PropertyStore.data) && !_.isUndefined(PropertyStore.data.status.data.addr_street_address)) {
            this.setState({
                property_address: PropertyStore.data.status.data.addr_street_address
            });
        }
        if(TakeoverStore.hasError === true) {
            this.setState({
                takeoverError: true,
                takeoverErrorMessage: TakeoverStore.errorMessage
            });
        } else {
            // Set tenant inspection
            let tenantInspection = _.clone(this.state.tenantInspection);
            if (!_.isNull(TakeoverStore.tenantInspection) && !_.isUndefined(TakeoverStore.tenantInspection)) {
                tenantInspection = TakeoverStore.tenantInspection;
            }
            this.setState({
                dataLoaded: TakeoverStore.loaded,
                checkList: TakeoverStore.checkList,
                info: TakeoverStore.info,
                takeoverError: TakeoverStore.hasError,
                emailsSent: TakeoverStore.emailsSent,
                tenantInspection,
                percentage: TakeoverStore.percentage
            });
        }
    }

    renderTenantAtProperty(index) {
        const state = typecast(this.state.checkList[index], 'boolean');
        return(<div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  checked={state}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Confirm that there is a tenant at the property</span>
                    </label>
                </div>
            </div>
            {(state === false) &&
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/payment'} className="DA-actionLink">Edit</a>
            </div>}
        </div>);
    }

    renderConfirmManagementStart(index) {
        let checkValue = this.state.checkList[index];
        let disabled = false;
        let checked = typecast(checkValue, 'boolean');
        if (checkValue === 2) {
            checked = false;
            disabled = true;
        }

        let managementStartDate = '';
        if (!_.isNull(this.state.info) & !_.isUndefined(this.state.info.management_start_date)) {
            managementStartDate = this.state.info.management_start_date;
        }

        let displayText = <span className="DA-CheckboxItem__label TOItem">Confirm management start date.</span>;
        if (!_.isEmpty(this.state.info.management_start_date)) {
            displayText = <span className="DA-CheckboxItem__label TOItem">Confirm management start date is <span className="TOItem TOItem--bold">{Moment(managementStartDate).format('MMMM DD, YYYY')}</span></span>;
        }

        let managementStart = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label>
                        <input className="DA-CheckboxItem__checkbox"
                               disabled={disabled}
                               checked={checked}
                               onChange={(e) => { this.changeListValue(index, e)}}
                               type="checkbox" id="1"/>
                        {/*<input className="DA-CheckboxItem__checkbox"*/}
                                  {/*type="checkbox" id="1"/>*/}
                        {displayText}
                    </label>
                </div>
            </div>
            {(checked === false) &&
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/property'} className="DA-actionLink">Edit</a>
            </div>}
        </div>;

        return managementStart;
    }

    handleDateChange(data, date) {
        this.setTenantInspectionDate(Moment(date).format('YYYY-MM-DD'));
        this.resetValidation();
    }

    handleTimeChange(data, time) {
        this.setTenantInspectionTime(Moment(time).format('HH:mm'));
        this.resetValidation();
    }

    renderTenantInspection(index) {

        let hasInspection = false;
        let inspectionTime = null;
        if (!_.isUndefined(this.state.info.tenant_inspection_date) && !_.isEmpty(this.state.info.tenant_inspection_date) &&
            !_.isUndefined(this.state.info.tenant_inspection_time) && !_.isEmpty(this.state.info.tenant_inspection_time)) {
            hasInspection = true;
            inspectionTime = Moment(this.state.info.tenant_inspection_date + ' ' + this.state.info.tenant_inspection_time).toDate();
        }

        let checkValue = this.state.checkList[index];
        let disabled = false;
        let checked = typecast(checkValue, 'boolean');
        if (checkValue === 2) {
            checked = false;
            disabled = true;
        }
        let hasLease = true;
        if (_.isUndefined(this.state.info.lease_id) || _.isNull(this.state.info.lease_id)) {
            hasLease = false;
        }

        const datePickerInputStyles = {
            'marginLeft': '35px',
            'opacity': '0.8',
            'color': '#000',
            'fontFamily': 'muli',
            'fontSize': '14px',
            'fontWeight': '400',
            'width': '70%'
        };

        if (checked) {
            datePickerInputStyles.color = 'rgba(0,0,0,.4)';
        }

        const timePickerTextStyles = {
            'width': '110px'
        };

        const datePickerTextStyles = {
            'minWidth': '170px',
            'width': 'auto'
        };

        const pickerRootStyle = {
            'display': 'inline-block'
        };

        const datePickerAttributes = {};
        if (!_.isNull(inspectionTime)) {
            datePickerAttributes .defaultDate = inspectionTime
        };

        const timePickerAttributes = {};
        if (!_.isNull(inspectionTime)) {
            timePickerAttributes .defaultTime = inspectionTime
        };

        let noLeaseMessage = <div className="TA-item__content TA-item__content-bondRef">
            <p className="TA-nolease-message">There is no lease on this property</p>

        </div>;

        const addButton = <a className="DA-actionLink DA-actionLink--sub"
                                 onClick={this.handleClickAddTenantInspection}>Add</a>;
        const saveButton = <a className="DA-actionLink DA-actionLink--sub"
                              onClick={this.handleClickUpdateTenantInspection}>Save</a>;
        const editButton = <a className="DA-actionLink DA-actionLink"
                              onClick={() => this.editTenantInspection(true)}>Edit</a>;

        const otherButtons = this.state.editTenantInspection ? saveButton : editButton;

        const actionControlles = hasInspection ? otherButtons : addButton;

        let disableInputs = checked || !this.state.editTenantInspection;
        if (hasInspection === false) {
            disableInputs = false;
        }

        // Disabled ticking while editing
        if (this.state.editTenantInspection) {
            disabled = true;
        }

        let tenantInspection = <div className="TA-item TA-item--tenantInspection">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label>
                        <input className="DA-CheckboxItem__checkbox"
                               disabled={disabled}
                               checked={checked}
                               onChange={(e) => { this.changeListValue(index, e)}}
                               type="checkbox" id="1"/>
                        {/*<input className="DA-CheckboxItem__checkbox"*/}
                                  {/*type="checkbox" id="1"/>*/}
                        <span className="DA-CheckboxItem__label TOItem">Schedule a tenant inspection</span>
                    </label>
                </div>
            </div>
            {hasLease ? <div className="TA-item__content TA-item__content--dates">
                <div className="TO-date-picker" onClick={this.handleClickDatePicker}>
                    <DatePicker
                        ref={el => this.datePicker = el}
                        {...datePickerAttributes}
                        disabled={disableInputs}
                        autoOk={true}
                        style={pickerRootStyle}
                        formatDate={(date) => {return Moment(date).format('MMM DD, YYYY')}}
                        className="TO-date-pickerddd"
                        hintText=""
                        id="date-picker"
                        // defaultDate={inspectionTime}
                        onChange={(data, date) => this.handleDateChange(data, date)}
                        textFieldStyle={datePickerTextStyles}
                        inputStyle={datePickerInputStyles}/>
                </div>
                <div onClick={this.handleClickTimePicker} className="TO-date-picker TO-date-picker--time">
                    <TimePicker
                        {...timePickerAttributes}
                        ref={el => this.timePicker = el}
                        disabled={disableInputs}
                        autoOk={true}
                        style={pickerRootStyle}
                        hintText=""
                        id="time-picker"
                        onChange={(data, time) => this.handleTimeChange(data, time)}
                        textFieldStyle={timePickerTextStyles}
                        inputStyle={datePickerInputStyles}
                    />
                </div>
                {!checked && actionControlles}
            </div> : noLeaseMessage}
            {!this.state.tenantInspectionValidation.isValid &&
            <div className="TA-item__content TA-item__content--datesValidation">
                <ErrorMessage error={!this.state.tenantInspectionValidation.isValid} message={this.state.tenantInspectionValidation.message} />
            </div>}
        </div>;

        return tenantInspection;
    }


    renderSendTitle(index) {
        let address = '';
        if (!_.isUndefined(this.state.info.owner_address)) {
            address = this.state.info.owner_address
        }

        let sendTitle = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  checked={this.state.checkList[index]}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Send the tile to <span className="TOItem TOItem--bold">{address}</span></span>
                    </label>
                </div>
            </div>
        </div>;
        return(sendTitle);
    }

    renderPrpoertyMe(index) {
        const state = typecast(this.state.checkList[index], 'boolean');
        let propertyMe = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  checked={state}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add details to PropertyMe</span>
                    </label>
                </div>
            </div>
            {(state === false) &&
            <div className="TA-item__content">
                <a href="https://www.propertyme.com.au/" target="_blank" className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>}
        </div>;

        return propertyMe;
    }

    renderBondReference(index) {
        let show = typecast(this.state.checkList[index], 'boolean');
        let disabled = false;
        if (this.state.checkList[index] === 2) {
            disabled = true;
            show = false;
        }

        let hasTenant = null;
        if(!_.isNull(this.state.info.lease_id)) {
            hasTenant = true;
        }

        let infoClass = "TA-infoText";
        if (show) {
            infoClass = "TA-infoText TA-infoText--checked";
        }

        let value = '';
        if (!_.isUndefined(this.state.info.bond_reference_number) && !_.isNull(this.state.info.bond_reference_number)) {
            value = this.state.info.bond_reference_number;
        }

        let inputBox = <div className="TA-item__content TA-item__content-bondRef">
            <input className="TA-Input TA-Input--bond-ref" value={value} onChange={this.handleChangeBondReference}/>
            {this.state.editBondRef  && <a className="DA-actionLink DA-actionLink--sub" onClick={this.handleSubmitBondReference}>Save</a>}
        </div>;

        let controlls = this.state.editBondRef ?
            inputBox : <div className="TA-item__content TA-item__content--bondRef TA-item__content--edit">
                {/*<input className="TA-Input TA-Input--bond-ref"/>*/}
                {this.state.info.bond_reference_number && <div className={infoClass}>{this.state.info.bond_reference_number}</div>}
                {!this.state.editBondRef && !show &&
                <a onClick={this.editBondReference} className="DA-actionLink">Edit</a>}
            </div>;

        let noLeaseMessage = <div className="TA-item__content TA-item__content-bondRef">
            <p className="TA-nolease-message">There is no lease on this property</p>

        </div>;

        let bondReference = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  disabled={disabled}
                                  checked={show}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Confirm bond reference number</span>
                    </label>
                </div>
            </div>
            {/*TODO: remove the commented section if not required after the takeover dashboard full release*/}
            {/*{hasTenant ? controlls : noLeaseMessage}*/}
            {controlls}
        </div>;

        return bondReference;
    }

    editBondReference() {
        this.setState({
            editBondRef: true
        });
    }

    handleSubmitBondReference() {
        let payload = only(this.state.info, ['property_id', 'lease_id', 'bond_reference_number']);
        if (_.isUndefined(payload.bond_reference_number)) {
            payload.bond_reference_number = '';
        }
        TakeoverService.updateBondReference(payload)
            .then((res) => {
                this.setState({
                    editBondRef: false
                });

                // Update check list status after update
                if (payload.bond_reference_number === '') {
                    let checkList = cloneObject(this.state.checkList);
                    checkList[CHECKLIST.CONFIRM_BOND_REFERENCE_NUMBER] = 2;
                    this.setState({checkList});
                } else {
                    let checkList = cloneObject(this.state.checkList);
                    checkList[CHECKLIST.CONFIRM_BOND_REFERENCE_NUMBER] = 0;
                    this.setState({checkList});
                }
            });
    }

    handleChangeBondReference(e) {
        let value = e.target.value;
        let isAllowed = !(value.match(/[^0-9|a-z|A-Z|-]/));
        if (typecast(value, 'string').indexOf(' ') > -1) { // has spaces
            isAllowed = false;
        }
        if (isAllowed) {
            if(_.isNull(this.state.info)) {
                let info = {
                    bond_reference_number: value
                };
                this.setState({
                    info: info
                });
            } else {
                let info = cloneObject(this.state.info);
                info.bond_reference_number = value;
                this.setState({
                    info: info
                });
            }
        }
    }

    renderRecurringBills(index) {
        const state = typecast(this.state.checkList[index], 'boolean');
        let recurringBills = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  checked={state}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Set up recurring bills</span>
                    </label>
                </div>
            </div>
            {(state === false) &&
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/payment?action=addbills'} className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>}
        </div>;

        return recurringBills;
    }

    renderAddLease(index) {
        let state = typecast(this.state.checkList[index], 'boolean');
        let disabled = false;
        if (this.state.checkList[index] === 2) {
            disabled = true;
            state = false;
        }
        let addLease = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  disabled={disabled}
                                  checked={state}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add the lease</span>
                    </label>
                </div>
            </div>
            {(state === false) &&
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/payment'} className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>}
        </div>;

        return addLease;
    }

    changeListValue(index, e) {
        let checkList = cloneObject(this.state.checkList);
        checkList[index] = e.target.checked;
        this.setState({checkList});
        const data = {};
        data.property_id = this.state.propertyId;
        data.status = e.target.checked;
        data.check_list_id = index;
        data.options = {};
        data.options.checkList = checkList;
        data.options.item = {};
        data.options.item.list_item = index;
        data.options.item.item_status = 0;
        if (e.target.checked === true) {
            data.options.item.item_status = 1;
        }

        // Handle extra data
        switch(index) {
            case CHECKLIST.ADD_TENANT:
                // data.options.refetch = true;
                data.options.fetchMails = true;
                data.lease_id = this.state.info.lease_id;
                break;
            case CHECKLIST.CONFIRM_BOND_REFERENCE_NUMBER:
            case CHECKLIST.ADD_LEASE:
                data.lease_id = this.state.info.lease_id;
                break;
            case CHECKLIST.SCHEDULE_TENANT_INSPECTION:
                data.lease_id = this.state.info.lease_id;
                if (!_.isNull(this.state.tenantInspection.tenant_inspection_id)) {
                    data.tenant_inspection_id = this.state.tenantInspection.tenant_inspection_id;
                }
                break;
            case CHECKLIST.ADD_KEY_DOCUMENTS:
                let field = DOC_TYPES.LEASE_AGREEMENT.FIELD;
                data[field] = this.state.info[field];
                field = DOC_TYPES.APPLICATION.FIELD;
                data[field] = this.state.info[field];
                field = DOC_TYPES.PRIOR_TENANT_LEDGER.FIELD;
                data[field] = this.state.info[field];
                break;
            case CHECKLIST.ADD_BOND_TRANSFER_DOCUMENT:
                const doc_field = DOC_TYPES.BOND_TRANSFER.FIELD;
                data[doc_field] = this.state.info[doc_field];
                field = DOC_TYPES.APPLICATION.FIELD;
                // data.options.refetch = true;
                data.options.fetchMails = true;
                break;
            default:
                break;
        }

        TakeoverService.updateCheckItem(data);
    }

    renderAddTenant(index) {
        let state = typecast(this.state.checkList[index], 'boolean');
        let disabled = false;
        if (this.state.checkList[index] === 2) {
            disabled = true;
            state = false;
        }

        let addTenant = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label>
                        <input className="DA-CheckboxItem__checkbox"
                               disabled={disabled}
                               checked={state}
                               onChange={(e) => { this.changeListValue(index, e)}}
                               type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add the tenant</span>
                    </label>
                </div>
            </div>
            {(state === false) &&
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/people?action=addtenant'} className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>}
        </div>;

        return addTenant;
    }

    renderBondTransfer(index) {
        let checkValue = this.state.checkList[index];
        let disabled = false;
        let checked = typecast(checkValue, 'boolean');
        if (checkValue === 2) {
            checked = false;
            disabled = true;
        }
        if (_.isNull(this.state.info.bond_transfer_document_id)) {
            disabled = true;
        }
        const componentName = 'bondTransfer';
        const uploaderClassNames = {
            'container': 'DA-Uploader--' + componentName + '_wrapper',
            'uploader': 'DA-Uploader DA-Uploader--' + componentName,
            'hintText': 'DA-Uploader__hint'
        };

        let fileNameLease = '';
        let info = this.state.info;
        if (!_.isUndefined(info[DOC_TYPES.BOND_TRANSFER.FILE_NAME])) {
            fileNameLease= info[DOC_TYPES.BOND_TRANSFER.FILE_NAME];
        }

        let bondTransfer = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label>
                        {/*<input className="DA-CheckboxItem__checkbox" type="checkbox" id="1"/>*/}
                        <input className="DA-CheckboxItem__checkbox"
                               disabled={disabled}
                               checked={checked}
                               onChange={(e) => { this.changeListValue(index, e)}}
                               type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add the signed bond transfer document</span>
                    </label>
                </div>
            </div>
            <div className="TA-item__content">
                <Uploader classNames={uploaderClassNames}
                          fileName={fileNameLease}
                          disabled={checked}
                          hasFile={!_.isNull(this.state.info.bond_transfer_document_id)}
                          propertyId={this.state.propertyId}
                          category={DOC_TYPES.BOND_TRANSFER}
                          fileType="Signed Bond Transfer"/>
            </div>
        </div>;

        return bondTransfer;
    }
    renderKeyDocuments(index) {
        let checkValue = this.state.checkList[index];
        let disabled = false;
        let checked = typecast(checkValue, 'boolean');
        if (checkValue === 2) {
            checked = false;
            disabled = true;
        }
        const keyDocsUploaderClassNames = {
            'container': 'DA-Uploader--keyDocs_wrapper',
            'uploader': 'DA-Uploader DA-Uploader--keyDocs',
            'hintText': 'DA-Uploader__hint'
        };

        let fileNames = {
            lease: '',
            tenant_ledger: '',
            application: ''
        };
        let info = this.state.info;
        if (!_.isUndefined(info[DOC_TYPES.LEASE_AGREEMENT.FILE_NAME])) {
            fileNames.lease = info[DOC_TYPES.LEASE_AGREEMENT.FILE_NAME];
        }
        if (!_.isUndefined(info[DOC_TYPES.PRIOR_TENANT_LEDGER.FILE_NAME])) {
            fileNames.tenant_ledger = info[DOC_TYPES.PRIOR_TENANT_LEDGER.FILE_NAME];
        }
        if (!_.isUndefined(info[DOC_TYPES.APPLICATION.FILE_NAME])) {
            fileNames.application = info[DOC_TYPES.APPLICATION.FILE_NAME];
        }

        let keyDocuments = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  disabled={disabled}
                                  checked={checked}
                                  onChange={(e) => { this.changeListValue(index, e)}}
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add key documents</span>
                    </label>
                </div>
            </div>
            <div className="TA-item__content">
                <Uploader classNames={keyDocsUploaderClassNames }
                          fileName={fileNames.lease}
                          disabled={checked}
                          hasFile={!_.isNull(this.state.info.lease_document_id)}
                          propertyId={this.state.propertyId}
                          category={DOC_TYPES.LEASE_AGREEMENT}
                          fileType="Lease"/>

                <Uploader classNames={keyDocsUploaderClassNames }
                          fileName={fileNames.tenant_ledger}
                          disabled={checked}
                          hasFile={!_.isNull(this.state.info.prior_tenant_ledger_document_id)}
                          propertyId={this.state.propertyId}
                          category={DOC_TYPES.PRIOR_TENANT_LEDGER}
                          fileType="Tenant ledger"/>

                <Uploader classNames={keyDocsUploaderClassNames }
                          fileName={fileNames.application}
                          disabled={checked}
                          hasFile={!_.isNull(this.state.info.application_document_id)}
                          propertyId={this.state.propertyId}
                          category={DOC_TYPES.APPLICATION}
                          fileType="Application"/>
            </div>
        </div>;

        return keyDocuments;
    }

    render(){
        let renderList = !this.state.takeoverError && this.state.dataLoaded && this.state.checkList;

        const uploaderClassNames = {
            'uploader': 'DA-Uploader',
            'hintText': 'DA-Uploader__hint'
        };

        let addTenant = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Add the tenant</span>
                    </label>
                </div>
            </div>
            <div className="TA-item__content">
                <a href={'#/view-property/' + OptimalHash.encode(this.state.propertyId) + '/people?action=addtenant'} className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>
        </div>;

        const datePickerInputStyles = {
            'marginLeft': '35px',
            'opacity': '0.8',
            'color': '#000',
            'fontFamily': 'aktiv-grotesk',
            'fontSize': '16px',
            'fontWeight': '400'
        };

        const timePickerTextStyles = {
            'width': '110px'
        };

        const datePickerTextStyles = {
            'minWidth': '170px',
            'width': 'auto'
        };

        const pickerRootStyle = {
            'display': 'inline-block'
        };

        let tenantInspection = <div className="TA-item">
            <div className="DA-CheckboxItem DA-CheckboxItem--ta">
                <div className="DA-CheckboxItem__checkboxWrap">
                    <label><input className="DA-CheckboxItem__checkbox"
                                  type="checkbox" id="1"/>
                        <span className="DA-CheckboxItem__label TOItem">Schedule a tenant inspection</span>
                    </label>
                </div>
            </div>
            <div className="TA-item__content TA-item__content--dates">
                <DatePicker
                    style={pickerRootStyle}
                    formatDate={this.formatDate}
                    className="TO-date-picker"
                    hintText=""
                    id="date-picker"
                    textFieldStyle={datePickerTextStyles}
                    inputStyle={datePickerInputStyles}/>
                <TimePicker
                    style={pickerRootStyle}
                    className="TO-date-picker TO-date-picker--time"
                    hintText=""
                    id="time-picker"
                    textFieldStyle={timePickerTextStyles}
                    inputStyle={datePickerInputStyles}
                />
                <a className="DA-actionLink DA-actionLink--sub">Add</a>
            </div>
        </div>;

        const keyDocsUploaderClassNames = {
            'container': 'DA-Uploader--keyDocs_wrapper',
            'uploader': 'DA-Uploader DA-Uploader--keyDocs',
            'hintText': 'DA-Uploader__hint'
        };

        let emailsList = [];
        if (!_.isNull(this.state.info) && !_.isUndefined(this.state.info.emailsSent)) {
            emailsList = this.state.info.emailsSent;
        }

        let percentage = 0;
        // if (!_.isUndefined(this.state.info) && !_.isUndefined(this.state.info.percentage) && !_.isNull(this.state.info.percentage)) {
        if (!_.isUndefined(this.state.info) && !_.isNull(this.state.info) && !_.isUndefined(this.state.info.percentage) && !_.isNull(this.state.info.percentage)) {
            percentage = this.state.info.percentage;
        }

        return (
            <div className="admin-padding-adjustment add-person-form-ta people-tab">
                <div className="section-header">
                    <h1>{this.state.property_address}<i className="oval"/>
                        <span className="document">DASHBOARD</span>
                    </h1>
                </div>
                {this.state.takeoverError &&  <div className="row TODashboard">
                    <div className="col-xs-12">

                        <p className="TOTitle"><span className="TOTitle__main TOTitle__main--error">{this.state.takeoverErrorMessage}</span></p>
                    </div>
                </div>}

                {renderList &&
                <div className="row TODashboard">
                    <div className="col-xs-12">

                        {this.state.devCompleted ?
                        <p className="TOTitle"><span className="TOTitle__main">There’s currently a tenant at this property</span> This takeover is
                            <Percentage value={this.state.percentage} />
                            completed</p>
                        : <p className="TOTitle"><span className="TOTitle__main">There’s currently a tenant at this property</span></p>}
                    </div>

                    <div className="col-xs-12 TOList">
                        <p className="TOList__title">Checklist</p>
                        {this.renderTenantAtProperty(CHECKLIST.CONFIRM_HAS_TENANT_AT_MANAGEMENT_START)}
                        {this.renderConfirmManagementStart(CHECKLIST.CONFIRM_MANAGEMENT_START_DATE)}
                        {this.renderSendTitle(CHECKLIST.SEND_TILE)}
                        {this.renderBondTransfer(CHECKLIST.ADD_BOND_TRANSFER_DOCUMENT)}
                        <div className="clear-fix clear-fix--TA-item"></div>
                        {addTenant && false}
                        {this.renderAddTenant(CHECKLIST.ADD_TENANT)}
                        {tenantInspection && false}
                        {this.renderTenantInspection(CHECKLIST.SCHEDULE_TENANT_INSPECTION)}
                        <div className="clear-fix clear-fix--TA-itemdd"></div>
                        {this.renderAddLease(CHECKLIST.ADD_LEASE)}
                        {this.renderRecurringBills(CHECKLIST.SETUP_RECURRING_BILLS)}
                        {this.renderKeyDocuments(CHECKLIST.ADD_KEY_DOCUMENTS)}
                        <div className="clear-fix clear-fix--TA-item"></div>
                        {this.renderPrpoertyMe(CHECKLIST.ADD_TO_PROPERTY_ME)}
                        {this.renderBondReference(CHECKLIST.CONFIRM_BOND_REFERENCE_NUMBER)}
                    </div>
                    {/* TODO: show mails list when api is ready*/}
                    {this.state.emailsSent.length > 0 &&
                    <div className="col-xs-12 TOList">
                        <p className="TOList__title">Emails we’ve sent automatically</p>
                        <ul className="TOAutoMail__list">
                            {this.state.emailsSent.map((mail, index)=> <li key={'mail-list-' + index} className="TOAutoMail">{mail}</li>)}
                        </ul>
                    </div>}
                </div>}
            </div>
        );
    }
}
