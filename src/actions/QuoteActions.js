import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    quoteRequest: (hash) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.QUOTE_REQUEST,
            hash: hash
        });
    }

}