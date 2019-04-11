import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';


class PropertyStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._propertyId = null;
        this._placeId = null;
        this._data = null;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case EVENTS.VIEW_PROPERTY:
                this._propertyId = action.id;
                this.emitChange();
                break;
            case EVENTS.ADDRESS_SELECTED:
                this._placeId = action.placeId;
                this.emitChange();
                break;
            case EVENTS.LOAD_PROPERTY:
                this._data = action.data;
                this.emit('change');
            default:
                break;
        }
    }

    get propertyId() {
        return this._propertyId;
    }

    get placeId() {
        return this._placeId;
    }

    get data() {
        return this._data;
    }
}

export default new PropertyStore();