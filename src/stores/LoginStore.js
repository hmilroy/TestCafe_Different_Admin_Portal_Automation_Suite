import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';

class LoginStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
    this._image = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case EVENTS.LOGIN_USER:
        this._jwt = action.jwt;
        this._user = action.user;
        this._image = action.image;
        this.emitChange();
        break;
      case EVENTS.LOGOUT_USER:
        this._user = null;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get user() {
    return this._user || JSON.parse(localStorage.getItem("user"));
  }

  get userObject() {
      return this._user || JSON.parse(localStorage.getItem("userObject"));
  }

  get userName() {
    if(!_.isUndefined(this.userObject) && !_.isNull(this.userObject)) {
      return this.userObject.name;
    } else {
      return '';
    }
  }

  get jwt() {
    return this._jwt || localStorage.getItem("jwt");
  }

  get image() {
    return this._image || localStorage.getItem("image");
  }

  isLoggedIn() {
    return this._user || localStorage.getItem("user");
  }
}

export default new LoginStore();
