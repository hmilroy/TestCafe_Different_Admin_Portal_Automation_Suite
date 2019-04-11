import React, { PropTypes } from 'react';
import LoginForm from '../../components/Forms/LoginForm.jsx';

import Auth from '../../services/AuthService.js';
import LoginStore from '../../stores/LoginStore.js'
import Toastr from 'toastr';
import URL_CONSTANTS from '../../constants/URLConstants.js';
import {handleError} from '../../utility/helpers.js';

class LoginPage extends React.Component {

    /**
     * Class constructor.
     */
    constructor(props, context) {
        super(props, context);

        // set the initial component state
        this.state = {
            errors: {},
            googleLogin: true,
            user: {
                userName: '',
                password: ''
            }
        };

        this.changeUser = this.changeUser.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    /**
     * Perform Login action
     * @param event Event
     */
    login(event) {
        event.preventDefault();
        Toastr.options.positionClass="toast-top-full-width";
        Auth.login(this.state.user.email, this.state.user.password)
            .then(function (response) {
                Toastr.success("Welcome " + response.data.user.name.split(' ')[0]);
            })
            .catch(error => {
                Toastr.error(JSON.parse(error.response).status.message)
            });
    }

    componentDidMount() {
        try {
            gapi.load('auth2', function() {
                gapi.auth2.init({
                    'client_id': URL_CONSTANTS.GOOGLE_CLIENT_ID,
                    'hosted_domain': 'different.com.au',
                    'scope': 'profile email',
                })
            });
            gapi.signin2.render('google-signin', {
                'width': 283,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': this.googleSignIn,
                'onfailure': this.onFailure
            });
        } catch (e) {
            this.setState({
                googleLogin: false
            });
        }
    }

    googleSignIn(googleUser) {
        Toastr.options.positionClass="toast-top-full-width";
        Auth.googleLogin(googleUser.getAuthResponse().id_token)
            .then(function (response) {
                Toastr.success("Welcome " + response.data.user.name.split(' ')[0]);
            })
            .catch(handleError);
    }

    onFailure(error) {
        Toastr.options.positionClass="toast-top-full-width";
        if (error.type === 'tokenFailed') {
            Toastr.error("Sorry, you're not authorised to log in to our admin system.");
        } else {
            Toastr.error("Authentication failed, please try again!");
        }
    }
    /**
     * Render the component.
     */
    render() {
        return (
            <LoginForm
                onSubmit={this.login}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}
                googleLogin={this.state.googleLogin}
            />
        );
    }

}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LoginPage;
