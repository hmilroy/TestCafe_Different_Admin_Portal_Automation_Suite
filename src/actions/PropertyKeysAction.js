import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    fetchKeys: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_KEYS,
            data: data.data
        });
    },
    updateKeys: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.UPDATE_KEYS,
            data: data
        });
    },
    resetKeys: () => {
        AppDispatcher.dispatch({
            actionType: EVENTS.RESET_KEYS
        });
    }
}