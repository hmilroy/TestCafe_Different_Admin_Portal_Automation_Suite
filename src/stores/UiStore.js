import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';

class UiStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(() => this._registerToAction.bind(this));
        this._activePropertyTab = null;
        this._activeNavTab = 'dashboard';
        this._activeDashboardTab = 'properties';
    }

    _registerToAction(action) {
        switch (action.actionType) {
            case EVENTS.PROPERTY_TAB_CHANGE:
                this._activePropertyTab = action.activeTab;
                this.emit('change');
                break;
            case EVENTS.NAV_TAB_CHANGE:
                this._activeNavTab = action.activeTab;
                this.emit('change');
                break;
            case EVENTS.DASHBOARD_TAB_CHANGE:
                this._activeDashboardTab = action.activeTab;
                this.emit('change');
                break;
            default:
                break;
        }
    }

    get activePropertyTab () {
        return this._activePropertyTab ;
    }
    get activeNavTab() {
        return this._activeNavTab;
    }
    get activeDashboardTab() {
        return this._activeDashboardTab;
    }
}

export default new UiStore();