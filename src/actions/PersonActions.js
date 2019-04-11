import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    viewPerson: (id, userType) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.VIEW_PERSON,
            id: id,
            type: userType
        });
    },

    viewPersonRoles: (id, email, name) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.VIEW_PERSON_ROLES,
            id: id,
            email: email,
            name: name
        });
    },

    addTenant: (propertyId) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.ADD_TENANT,
            propertyId: propertyId,
            type: 'Tenant'
        });
    },

    addPropertyManager: (propertyId) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.ADD_TENANT,
            propertyId: propertyId,
            type: 'Property Manager'
        });
    },

    addStrata: (propertyId) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.ADD_TENANT,
            propertyId: propertyId,
            type: 'Strata Manager'
        });
    },

    addRole: (userId, userRole) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.ADD_ROLE,
            userId: userId,
            userRole: userRole
        });
    },

    notAddingRole: () => {
        AppDispatcher.dispatch({
            actionType: EVENTS.NOT_ADDING_ROLE
        });
    },

    storePerson: (person) => {
        AppDispatcher.dispatch({
            actionType: EVENTS.FETCH_PERSON,
            person: person
        });
    }
}
