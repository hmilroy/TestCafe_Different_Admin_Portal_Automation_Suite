import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    holdingDepositChanged(data) {
        AppDispatcher.dispatch({
            actionType: EVENTS.HOLDING_DEPOSIT_CHANGE,
            data: data
        });
    },
    apiResponse(data) {
        AppDispatcher.dispatch({
            actionType: EVENTS.HOLDING_DEPOSIT_RESPONSE,
            data: data
        });
    },
    updateStatus(data) {
        AppDispatcher.dispatch({
            actionType: EVENTS.HOLDING_DEPOSIT_UPDATE_STATUS,
            data: data
        });
    },
    updateValidation(data) {
        AppDispatcher.dispatch({
            actionType: EVENTS.HOLDING_DEPOSIT_VALIDATION_CHANGE,
            data: data
        });
    },
    formValidated() {
        AppDispatcher.dispatch({
            actionType: EVENTS.HOLDING_DEPOSIT_FORM_VALIDATED
        });
    }
}