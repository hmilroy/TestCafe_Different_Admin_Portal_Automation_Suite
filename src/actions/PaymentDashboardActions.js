import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    updatPaymentsList: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.PAYMENTS.UPDATE_ALL_PAYMENTS_LIST,
            data: data
        });
    },
    updateOptions: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.PAYMENTS.UPDATE_OPTIONS,
            data: data
        });
    }
}