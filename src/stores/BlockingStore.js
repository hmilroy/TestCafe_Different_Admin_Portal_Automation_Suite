import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';

class BlockingStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._blocking = false;
    }

    _registerToActions(action) {
        switch (action.actionType) {
            case EVENTS.SHOW_BLOCKER:
                this._blocking = true;
                this.emit('change');
                break;
            case EVENTS.HIDE_BLOCKER:
                this._blocking = false;
                this.emit('change');
                break;
            default:
                break;
        }
    }

    get blocking() {
        return this._blocking;
    }
}

export default new BlockingStore();