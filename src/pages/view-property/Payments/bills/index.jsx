import React from 'react';
import _ from 'underscore';
import './bills.scss';
import BillItem from './bill-item.jsx';
import BillsService from '../../../../services/BillsService.js';
import BillsStore from '../../../../stores/BillsStore.js';
import Toastr from 'toastr';
import {handleError, handleSuccess} from '../../../../utility/helpers';

export default class Bills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: BillsStore.billsObject,
            oldBills: BillsStore.billsObject,
            edit: {
                1: false,
                2: false,
                3: false
            },
            isValid: {
                1: false,
                2: false,
                3: false
            },
            isEditing: false,
            newBills: null,
            isValidEdit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTick = this.handleTick.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.updateBillsFromStore = this.updateBillsFromStore.bind(this);
        this._mount = false;
    }
    componentDidMount() {
        window.scroll(0, 0);
        this._mount = true;
        this.updateBillsFromStore();
        BillsStore.on('change', () => {
            if (this._mount) {
                this.setState({
                    bills: this.cloneObject(BillsStore.billsObject),
                    oldBills: this.cloneObject(BillsStore.billsObject)
                });
                this.updateBillsFromStore();
            };
        });

        BillsService.fetchBills(this.props.propertyId)
    }

    componentWillUnmount() {
        BillsStore.removeChangeListener(()=> {});
        this._mount = false;
    }

    updateBillsFromStore() {
        if (!_.isUndefined(BillsStore.bills) && !_.isUndefined(BillsStore.bills)) {

            this.setState({
                bills: this.cloneObject(BillsStore.billsObject)
            });
        }
    }

    handleClickEdit() {
        this.setState({
            isEditing: true
        });
    }

    cloneObject(obj) {
        let text = JSON.stringify(obj);
        return JSON.parse(text);
    }
    handleClickCancel() {
        this.setState({
            isEditing: false,
            bills: BillsStore.billsObject
        });
    }

    validateEmail(email) {
        var x = email;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            return false;
        }
        return true;
    }

    handleClickSave() {
        let self = this;
        let isValid = true;
        let bills = this.cloneObject(this.state.bills);
        _(this.state.bills).each((bill, index) => {
            bills[index].validation = true;
            bills[index].validationError = '';
            if (bill.active ) {
                if ((bill.email !== '' && bill.email !== null) && !self.validateEmail(bill.email) ) {
                    bills[index].validation = false;
                    bills[index].validationError = 'This is not a valid email';
                    isValid = false;
                } else if (bill.emailRequired && bill.email === '') {
                    bills[index].validation = false;
                    bills[index].validationError = 'Email is Required';
                    isValid = false;
                }
            }
        });
        this.setState({
            bills
        });
        if (isValid) {
            let data = {
                propertyId: this.props.propertyId,
                bills: this.cloneObject(this.state.bills)
            };
            // check if data water email has changed
            let billTypeNumber = 1;
             if (this.state.bills[billTypeNumber].active === this.state.oldBills[billTypeNumber].active) {
                delete data.bills[billTypeNumber];
            }
            // check if data starata email has changed
            billTypeNumber = 2;
            if (this.state.bills[billTypeNumber].active === true && this.state.bills[billTypeNumber].email === this.state.oldBills[billTypeNumber].email) {
                delete data.bills[billTypeNumber];
            } else if (!this.state.bills[billTypeNumber].active && !this.state.oldBills[billTypeNumber].active) {
                delete data.bills[billTypeNumber];
            }
            // check if data council email has changed
            billTypeNumber = 3;
            if (this.state.bills[billTypeNumber].active === true && this.state.bills[billTypeNumber].email === this.state.oldBills[billTypeNumber].email) {
                delete data.bills[billTypeNumber];
            } else if (!this.state.bills[billTypeNumber].active && !this.state.oldBills[billTypeNumber].active) {
                delete data.bills[billTypeNumber];
            }

            if(_.isEmpty(data.bills)) {
                Toastr.success("Nothing to update");
                this.setState({
                    isEditing: false
                });
            } else {
                BillsService.updateBills(data)
                    .then((result) => {
                        BillsService.fetchBills(this.props.propertyId);
                        this.setState({
                            isEditing: false
                        });
                        handleSuccess(result);
                    })
                    .catch((e) => {
                        handleError(e);
                    })
            }
        }
    }

    handleChange(value) {
        let bills = _.clone(this.state.bills);
        bills[value.bill_type].email = value.email;
        this.setState({
            bills
        });
    }

    handleTick(value) {
        let bills = _.clone(this.state.bills);
        bills[value.bill_type].active = value.active;
        this.setState({
            bills
        });
    }

    render() {
        let hasBills = !_.isEmpty(this.state.bills);
        return (
            <div className="payment-section bills-section">
                {hasBills &&
                    <div>
                <BillItem
                    showDate={false}
                    bill={this.state.bills[1]}
                    edit={this.state.edit[1] && this.state.isEditing}
                    isEditing={this.state.isEditing}
                    isValid={this.state.isValid[1]}
                    onTick={(value) => this.handleTick(value)}
                    onChange={(value)=> this.handleChange(value)}/>

                <BillItem
                    showDate={true}
                    bill={this.state.bills[2]}
                    edit={this.state.edit[2] && this.state.isEditing}
                    isEditing={this.state.isEditing}
                    value={this.state.bills[2].email}
                    isValid={this.state.isValid[2]}
                    onTick={(value) => this.handleTick(value)}
                    onChange={(value)=> this.handleChange(value)}/>

                <BillItem
                    showDate={true}
                    bill={this.state.bills[3]}
                    edit={this.state.edit[3] && this.state.isEditing}
                    isEditing={this.state.isEditing}
                    value={this.state.bills[3].email}
                    isValid={this.state.isValid[3]}
                    onTick={(value) => this.handleTick(value)}
                    onChange={(value)=> this.handleChange(value)}/>
                    </div>
                }
                {(!this.state.isValidEdit) && <p className="DA-BillItem__error">Please select an item to edit</p>}
                {this.state.isEditing ? <div>
                    <button className="button bill-button" onClick={this.handleClickCancel}>Cancel</button>
                    <button className="button button_main bill-button" onClick={this.handleClickSave}>Save</button>
                </div>
                : <div>
                        <button className="button button_main bill-button" onClick={this.handleClickEdit}>Edit</button>
                </div>}
            </div>
        )
    }
}