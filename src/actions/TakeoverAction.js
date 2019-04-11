import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    updateInfo: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_TAKEOVER,
            data: data
        });
    },
    updateMails: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_TAKEOVER_MAILS,
            data: data
        });
    },
    updateErrorMessage: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_ERROR,
            data: data
        });
    },
    uploadedDocument: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_DOCUMENT_UPLOAD,
            data: data
        });
    },
    removeDocument: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_REMOVE_DOCUMENT,
            data: data
        });
    },
    changeCheckboxStatus: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_CHANGE_CHECKBOX_STATUS,
            data: data
        });
    },
    changeTenantInspectionDate: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_CHANGE_TENANT_INSPECTION,
            data: data
        })
    },
    updatePercentage: (data) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.TAKEOVER_CHANGE_PERCENTAGE,
            data: data
        });
    }

}