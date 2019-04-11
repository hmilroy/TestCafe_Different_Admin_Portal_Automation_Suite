import request from 'reqwest';
import when from 'when';
import LOGIN_CONSTANTS from '../constants/URLConstants.js';
import LoginActions from '../actions/LoginActions.js';
import 'clientjs';

let client = new ClientJS();

let fingerPrint = client.getFingerprint();
let os = client.getOS();
let browser = client.getBrowser();

let device_id = fingerPrint + "_" + os + "_" + browser;


class AuthService {

  login(email, password) {
    return this.handleAuth(when(request({
      url: LOGIN_CONSTANTS.LOGIN_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      data: {
          email, password, device_id
      }
    })));
  }

    googleLogin(id_token) {
        return this.handleAuth(when(request({
            url: LOGIN_CONSTANTS.GOOGLE_LOGIN_URL,
            method: 'POST',
            crossOrigin: true,
            type: 'json',
            data: {
                id_token, device_id
            }
        })));
    }

  logout() {
      gapi.load('auth2', function() {
          gapi.auth2.init({
              'client_id': LOGIN_CONSTANTS.GOOGLE_CLIENT_ID,
              'hosted_domain': 'different.com.au',
              'scope': 'profile email'
          }).then(function () {
              let auth2 = gapi.auth2.getAuthInstance();
              auth2.signOut().then(function () {
                  LoginActions.logoutUser();
              });
          })
      });
  }

  handleAuth(loginPromise) {
      return loginPromise
      .then(function(response) {
          let jwt = response.data.accessToken;
          let user = response.data.user;

          return when(request({
              url: LOGIN_CONSTANTS.PROFILE,
              method: 'GET',
              crossOrigin: true,
              type: 'json',
              headers: {
                  'Authorization': jwt
              }
          }))
              .then(function (result) {
                  LoginActions.loginUser(jwt,user,result.data.profile.profile_image);
                  return response;
              });
      })
  }
}

export default new AuthService()
