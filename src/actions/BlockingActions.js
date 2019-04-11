import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    block: ()=> {
        AppDispatcher.dispatch({
            actionType: EVENTS.SHOW_BLOCKER
        });
    },
    unblock: ()=> {
        AppDispatcher.dispatch({
            actionType: EVENTS.HIDE_BLOCKER
        });
    }
}