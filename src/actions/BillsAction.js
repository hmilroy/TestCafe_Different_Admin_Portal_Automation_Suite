import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';


export default {
    fetchBills: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_BILLS,
            bills: data.data
        });
    },
    updateBills: (data) => {
        AppDispatcher.dispatch(({
            actionType: EVENTS.UPDATE_BILLS,
            data: data
        }));
    },
    resetBills: () => {
        AppDispatcher.dispatch(({
            actionType: EVENTS.RESET_BILLS
        }));
    }
}