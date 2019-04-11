import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';
import _ from 'underscore';

class BillsStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._bills = [
            {
                bill_type: 1,
                active: false,
                email: '',
                label: 'Water',
                emailRequired: false,
                validation: true,
                validationError: ''
            },
            {
                bill_type: 2,
                active: false,
                email: '',
                label: 'Strata',
                emailRequired: true,
                validation: true,
                validationError: ''
            },
            {
                bill_type: 3,
                active: false,
                email: '',
                label: 'Council',
                emailRequired: true,
                validation: true,
                validationError: ''
            }
        ];
        this._billsObject = {};
    }

    resetState() {
        this._bills = [
            {
                bill_type: 1,
                active: false,
                email: '',
                label: 'Water',
                emailRequired: false,
                validation: true,
                validationError: ''
            },
            {
                bill_type: 2,
                active: false,
                email: '',
                label: 'Strata',
                emailRequired: true,
                validation: true,
                validationError: ''
            },
            {
                bill_type: 3,
                active: false,
                email: '',
                label: 'Council',
                emailRequired: true,
                validation: true,
                validationError: ''
            }
        ];
    }

    _registerToActions(action) {
        switch (action.actionType) {
            case EVENTS.FETCH_BILLS:
                this.resetState()
                this.bills.forEach((bill, index) => {
                    let newBill = _.findWhere(action.bills, {bill_type: bill.bill_type});
                    if (!_.isUndefined(newBill)) {
                        this.bills[index] = _.extend(bill, _.findWhere(action.bills, {bill_type: bill.bill_type}));
                        this.bills[index]['active'] = true;
                    }

                });
                this.bills.forEach((bill) => {
                    let billsObject = _.clone(this.billsObject);
                    billsObject[bill.bill_type] = bill;
                    this._billsObject = billsObject;
                });
                this.emit('change');
                break;
            case EVENTS.UPDATE_BILLS:
                let added_bills = JSON.parse(action.data.added_bills);
                let removed_bills = JSON.parse(action.data.removed_bills);
                _(added_bills).each((bill) => {
                    this._billsObject[bill.bill_type].active = true;
                    if (bill.email) {
                        this._billsObject[bill.bill_type].email = bill.email;
                    }
                });
                _(removed_bills).each((bill) => {
                    this._billsObject[bill.bill_type].active = false;
                    this._billsObject[bill.bill_type].email = '';
                });
                this.emit('change');
                break;
            case EVENTS.RESET_BILLS:
                // return;
                this.resetState()
                this.bills.forEach((bill) => {
                    let billsObject = _.clone(this.billsObject);
                    billsObject[bill.bill_type] = bill;
                    this._billsObject = billsObject;
                });
                this.emit('change');
                break;
            default:
                break;
        }
    }

    get bills() {
        return this._bills;
    }
    get billsObject() {
        let bills = JSON.stringify(this._billsObject);
        return JSON.parse(bills);
    }
}

let bills = new BillsStore();
export default bills;