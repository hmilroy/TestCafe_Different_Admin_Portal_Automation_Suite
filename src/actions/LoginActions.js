import AppDispatcher from '../dispatchers/AppDispatcher.js';
import EVENTS from '../constants/eventsConstants.js';

export default {
    loginUser: (jwt, user, image) => {
        let savedJwt = localStorage.getItem('jwt');
        AppDispatcher.dispatch({
            actionType: EVENTS.LOGIN_USER,
            jwt: jwt,
            user: user,
            image: image
        });

        if (savedJwt !== jwt) {
            localStorage.setItem('jwt', jwt);
            localStorage.setItem('user', user);
            localStorage.setItem('userObject', JSON.stringify(user));
            localStorage.setItem('image', image);
        }
    },
    logoutUser: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem('image');
        AppDispatcher.dispatch({
            actionType: EVENTS.LOGOUT_USER
        });
        window.location.href='/#/' ;
    }
}
