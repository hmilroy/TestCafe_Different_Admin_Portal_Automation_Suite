import EVENTS from '../constants/eventsConstants.js';
import apiConstants from '../constants/apiConstants';
import BaseStore from './BaseStore';
import _ from 'underscore';
import typecast from 'typecast';

class PropertyKeysStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._keyData = null;
        this._id = null;
        this._keyNumber = '';
        this._hasLeasing = false;
        this._hasManagement = true;
        this._hasTenant = false;
        this._notes = '';
        this._availableKeys = [];
    }

    _registerToActions(action) {
        switch (action.actionType) {
            case EVENTS.FETCH_KEYS:
                this._keyData = action.data; 
                if (!_.isNull(action.data) && !_.isUndefined(action.data)) {
                    this._id = action.data.id;
                    if (!_.isNull(action.data.storage_identifier)) {
                        this._keyNumber = action.data.storage_identifier;
                    }
                    if (!_.isNull(action.data.has_leasing_key)) {
                        this._hasLeasing = typecast(action.data.has_leasing_key, 'boolean');
                    }
                    if (!_.isNull(action.data.has_management_key)) {
                        this._hasManagement = typecast(action.data.has_management_key, 'boolean');
                    }
                    if (!_.isNull(action.data.has_tenant_key)) {
                        this._hasTenant = typecast(action.data.has_tenant_key, 'boolean');
                    }
                    if (!_.isNull(action.data.note)) {
                        this._notes = action.data.note;
                    }
                    if (this._hasLeasing) {
                        this._availableKeys.push(apiConstants.KEYS.LEASING);
                    }
                    if (this._hasManagement) {
                        this._availableKeys.push(apiConstants.KEYS.MANAGEMENT);
                    }
                    if (this._hasTenant) {
                        this._availableKeys.push(apiConstants.KEYS.TENANT);
                    }
                }
                this.emit('change');
                break;
            case EVENTS.UPDATE_KEYS:
                this._keyData = action.data;
                this._hasLeasing = action.data.has_leasing_key;
                this._hasManagement = action.data.has_management_key;
                this._hasTenant = action.data.has_tenant_key;
                this._notes = action.data.note;
                break;
            case EVENTS.RESET_KEYS:
                this._keyData = null;
                this._id = null;
                this._keyNumber = '';
                this._hasLeasing = false;
                this._hasManagement = true;
                this._hasTenant = false;
                this._notes = '';
                break;
            default:
                break;
        }
    }

    get keyData() {
        return this._keyData;
    }
    get id() {
        return this._id;
    }
    get keyNumber() {
        return this._keyNumber;
    }
    get hasLeasing() {
        return this._hasLeasing;
    }

    get hasManagement() {
        return this._hasManagement;
    }
    get hasTenant() {
        return this._hasTenant;
    }
    get notes() {
        return this._notes;
    }
}

let keys = new PropertyKeysStore();
export default keys;