import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    searchResult: (result) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.SEARCH_RESULT,
            result: result
        });
    },

    searchAllResult: (result) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.SEARCH_ALL_RESULT,
            result: result
        });
    }

}