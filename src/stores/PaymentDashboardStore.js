import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';
import PDStore from '../services/PaymentDashboardService';
import _ from 'underscore';
import moment from 'moment';

class PaymentDashboardStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToAction.bind(this));
        this._payments_list = [];
        this._start_date = moment(new Date()).format('YYYY-MM-DD');
        this._loading = true;
    }

     _registerToAction(action) {
        switch (action.actionType) {
            case EVENTS.PAYMENTS.UPDATE_ALL_PAYMENTS_LIST:
                this._payments_list = action.data;
                this._loading = false;
                this.emit('change');
                break;
            case EVENTS.PAYMENTS.UPDATE_OPTIONS:
                if (!_.isUndefined(action.data.start_date) && !_.isNull(action.data.start_date)) {
                    this._start_date = action.data.start_date;
                    this._loading = true;
                    this.emit('change');
                }
                let options = {
                    start_date: this._start_date
                };
                PDStore.fetchAllPayments(options);
                break;
            default:
                break;
        }
    }

    get paymentList() {
        return this._payments_list;
    }
    get date() {
        return this._start_date;
    }
    get loading() {
        return this._loading;
    }
}

export default new PaymentDashboardStore();