import AppDispatcher from '../dispatchers/AppDispatcher';
import EVENTS from '../constants/eventsConstants';

export default {
    changePropertyTab: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.PROPERTY_TAB_CHANGE,
            activeTab: data.activeTab
        });
    },
    changeNavTab: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.NAV_TAB_CHANGE,
            activeTab: data.activeTab
        });
    },
    changeDashboardTab: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.DASHBOARD_TAB_CHANGE,
            activeTab: data.activeTab
        });
    }
}