import EVENTS from '../constants/eventsConstants';
import BaseStore from './BaseStore';
import _ from 'underscore';
import API from '../constants/apiConstants';

class HoldingDepositStore extends BaseStore {
    get status() {
        return this._status;
    }
    get response() {
        return this._response;
    }

    constructor() {
        super();
        this.subscribe(() => this._registerToAction.bind(this));
        this._payment_type = '';
        this._property_id  = '';
        this._card_expiry = '';
        this._card_number = '';
        this._card_holder = '';
        this._card_cvv = '';
        this._email = '';
        this._amount = '';
        this._response = null;
        this._status = API.HOLDING_DEPOSITS.STATUS.FRESH;
    }

    _registerToAction(action) {
        switch (action.actionType) {
            case EVENTS.HOLDING_DEPOSIT_CHANGE:
                this._payment_type = action.data.payment_type;
                this._property_id  = action.data.property_id ;
                this._card_expiry = action.data.card_expiry;
                this._card_number = action.data.card_number;
                this._card_holder = action.data.card_holder;
                this._card_cvv = action.data.card_cvv;
                this._email = action.data.email;
                this._amount = action.data.amount;
                this.emit('change');
                break;
            case EVENTS.HOLDING_DEPOSIT_RESPONSE:
                this._response = action.data;
                this.emit('change');
                break;
            case EVENTS.HOLDING_DEPOSIT_UPDATE_STATUS:
                this._status = action.data.status;
                if (action.data.status === API.HOLDING_DEPOSITS.STATUS.FRESH) {
                    this.resetStore();
                    this.emit('change');
                }
                this.emit('statusChanged');
                break;
            case EVENTS.HOLDING_DEPOSIT_FORM_VALIDATED:
                this.emit('validated');
            default:
                break;
        }
    }

    resetStore() {
        this._payment_type = '';
        this._property_id  = '';
        this._card_expiry = '';
        this._card_number = '';
        this._card_holder = '';
        this._card_cvv = '';
        this._email = '';
        this._amount = '';
        this._response = null;
    }

    get form_data() {
        return {
            payment_type: '10',
            property_id : this.property_id,
            card_expiry:this.card_expiry,
            card_number: this.card_number.removeSpaces(),
            card_holder: this.card_holder,
            card_cvv: this.card_cvv,
            email: this.email,
            amount: this.amount
        }
    }
    get payment_type() {
        return this._payment_type;
    }

    get property_id() {
        return this._property_id;
    }

    get card_expiry() {
        return this._card_expiry;
    }

    get card_number() {
        return this._card_number;
    }

    get card_holder() {
        return this._card_holder;
    }

    get card_cvv() {
        return this._card_cvv;
    }

    get email() {
        return this._email;
    }

    get amount() {
        return this._amount;
    }
}

export default new HoldingDepositStore();