import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';


class PersonStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._personId = null;
        this._propertyId = null;
        this._type = null;
        this._newRole = null;
        this._addRole = false;
        this._personEmail = null;
        this._personName = null;
        this._person = null;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case EVENTS.VIEW_PERSON:
                this._personId = action.id;
                this._type = action.type;
                this.emitChange();
                break;
            case EVENTS.ADD_TENANT:
                this._propertyId = action.propertyId;
                this._type = action.type;
                this.emitChange();
                break;
            case EVENTS.ADD_ROLE:
                this._personId = action.userId;
                this._newRole = action.userRole;
                this._addRole = true;
                this.emitChange();
                break;
            case EVENTS.NOT_ADDING_ROLE:
                this._addRole = false;
                this._newRole = '';
                break;
            case EVENTS.VIEW_PERSON_ROLES:
                this._personId = action.id;
                this._personEmail = action.email;
                this._personName = action.name;
                break;
            case EVENTS.FETCH_PERSON:
                this._person = action.person;
                break;
            default:
                break;
        }
    }

    get personId() {
        return this._personId;
    }
    get propertyId() {
        return this._propertyId;
    }
    get type() {
        return this._type;
    }
    get newRole() {
        return this._newRole;
    }
    get isAddingRole() {
        return this._addRole;
    }
    get personEmail() {
        return this._personEmail;
    }
    get personName() {
        return this._personName;
    }
    get person() {
        return this._person;
    }
}

let personStore = new PersonStore();
export default personStore;