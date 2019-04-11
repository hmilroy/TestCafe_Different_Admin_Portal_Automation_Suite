import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    viewProperty: (id) => {
        setTimeout(function () {
            AppDispatcher.dispatch({
                actionType: EVENTS.VIEW_PROPERTY,
                id: id
            });
        })
    },

    addressSelected: (placeId) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.ADDRESS_SELECTED,
            placeId: placeId
        });
    },

    loadProperty: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.LOAD_PROPERTY,
            data: data
        });
    }
}
