import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';

class QuoteStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._hash = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case EVENTS.QUOTE_REQUEST:
        this._hash = action.hash;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get hash() {
    return this._hash;
  }
}

export default new QuoteStore();
