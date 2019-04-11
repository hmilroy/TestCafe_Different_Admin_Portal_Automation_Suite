import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';
import _ from 'underscore';

class TakeoverStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToAction.bind(this));
        this._has_error = false;
        this._error_info = null;
        this._error_message = '';
        this._info = null;
        this._check_list = [];
        this._loaded = false;
        this._property_id;
        this._emails_sent = [];
        this._tenant_inspection = {
            inspection_date: '',
            inspection_time: '',
            tenant_inspection_id: null
        };
        this._percentage = 0;
    }



    _registerToAction(action) {
        switch (action.actionType) {
            case EVENTS.TAKEOVER_ERROR:
                this._has_error = true;
                this._error_info = action.data;
                this._error_message = action.data.status.message;
                this.emit('change');
                break;
            case EVENTS.FETCH_TAKEOVER:
                if (!_.isUndefined(action.data.check_list_items)) {
                    this._check_list = action.data.check_list_items;
                }
                if (!_.isUndefined(action.data.property_id)) {
                    this._property_id = action.data.property_id;
                }
                if (!_.isUndefined(action.data.emails_sent)) {
                    this._emails_sent = action.data.emails_sent;
                }
                this._has_error = false;
                this._info = action.data;
                this._has_error = false;
                this._loaded = true;
                // Setting tenant inspection
                if (!_.isUndefined(action.data.tenant_inspection_date) && !_.isUndefined(action.data.tenant_inspection_time)) {
                this._tenant_inspection.inspection_date = action.data.tenant_inspection_date;
                this._tenant_inspection.inspection_time = action.data.tenant_inspection_time;
                this._tenant_inspection.tenant_inspection_id = action.data.tenant_inspection_id;
                }
                if (!_.isNull(action.data.percentage)) {
                    this._percentage = action.data.percentage;
                } else {
                    this._percentage = 0;
                }
                this.emit('change');
                break;
            case EVENTS.TAKEOVER_DOCUMENT_UPLOAD:
                if (!_.isUndefined(action.data.new_document_id)) {
                    this._info[action.data.category_name] = action.data.new_document_id;
                    this._info[action.data.document_name_field] = action.data.new_document_file_name;
                    this.emit('change');
                }
                break;
            case EVENTS.TAKEOVER_REMOVE_DOCUMENT:
                this._info[action.data.category_name] = null;
                this.emit('change');
                break;
            case EVENTS.TAKEOVER_CHANGE_CHECKBOX_STATUS:
                this._check_list[action.data.list_item] = action.data.item_status;
                break;
            case EVENTS.FETCH_TAKEOVER_MAILS:
                if (!_.isUndefined(action.data.emails_sent)) {
                    this._emails_sent = action.data.emails_sent;
                }
                this.emit('mailsUpdated');
                break;
            case EVENTS.TAKEOVER_CHANGE_TENANT_INSPECTION:
                _.extend(this._tenant_inspection, action.data);
                break;
            case EVENTS.TAKEOVER_CHANGE_PERCENTAGE:
                this._percentage = action.data.percentage;
                this.emit('percentageChanged');
                break;
            default:
                break;
        }
    }

    get hasError() {
        return this._has_error;
    }

    get errorInfo() {
        return this._error_info;
    }

    get errorMessage() {
        return this._error_message;
    }

    get checkList() {
        return this._check_list;
    }

    get loaded() {
        return this._loaded;
    }

    get info() {
        return this._info;
    }

    get propertyId() {
        return this._property_id;
    }

    get emailsSent() {
        return this._emails_sent;
    }

    get tenantInspection() {
        return this._tenant_inspection;
    }

    get percentage() {
        return this._percentage;
    }
}

export default new TakeoverStore();