import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    fetchVacancy(data) {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_VACANCY,
            data: data
        });
    }
}