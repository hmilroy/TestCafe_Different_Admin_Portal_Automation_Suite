import _ from 'underscore';
import dig from 'object-dig';
import Toaster from 'toastr';
import AuthService from '../services/AuthService';

export function emailValidator(text) {
    let isValid = true;
    let atpos = text.indexOf('@');
    let dotpos = text.lastIndexOf('.');
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= text.length) {
        isValid = false;
    }
    return isValid;
}

export function cloneObject(obj) {
    if (_.isUndefined(obj)) {
        return undefined;
    }
    if (_.isNull(obj)) {
        return null;
    }
    return JSON.parse(JSON.stringify(obj));
}

export function capitalize(str, lowercaseRest) {
    let remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();
    return str.charAt(0).toUpperCase() + remainingChars;
}

export function capitalizeFirstLetter(str) {
    return str.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase());
}

export function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function handleError(error) {
    const genericMessage = 'Something went wrong';
    if (!_.isUndefined(error.status)) {
        switch (error.status) {
            case 401:
                AuthService.logout();
                break;
            default:
                if (!_.isUndefined(dig(error, 'response')) && typeof error.response === 'string') {
                    let response = JSON.parse(error.response);
                    if (!_.isUndefined(dig(response, 'status', 'message'))) {
                        Toaster.error(response.status.message);
                    } else {
                        Toaster.error(genericMessage);
                    }
                } else if (!_.isUndefined(dig(error, 'error')) && typeof error.error === 'string') {
                    let response = JSON.parse(error.error);
                    if (!_.isUndefined(dig(response, 'status', 'message'))) {
                        Toaster.error(response.status.message);
                    } else {
                        Toaster.error(genericMessage);
                    }
                } else {
                    Toaster.error(genericMessage);
                }
        }
    } else {
        Toaster.error(genericMessage);
    }
}

export function handleSuccess(res, cb) {
    if (!_.isUndefined(res.status) && !_.isNull(res.status) && !_.isUndefined(res.status.code) && !_.isUndefined(res.status.message) && res.status.code === 200) {
        Toaster.success(res.status.message);
    } else if (!_.isUndefined(res.data)
        && !_.isNull(res.data)
        && !_.isUndefined(res.data.status)
        && !_.isNull(res.data.status)
        && !_.isUndefined(res.data.status.message)) {
        Toaster.success(res.data.status.message);
    } else {
        Toaster.error('Request was successful');
    }
    cb;
}

export function makeErrorPromise(errorMessage) {
    let response = {
        status: {
            message: errorMessage
        }
    };

    let error = {
        response: JSON.stringify(response),
        status: null
    };
    return new Promise((resolve, reject) => {
        reject(error);
    });
}

export function isCurrencyInput(str) {
    let numberOfDots = str.count(/\./g);
    console.log('number of dots = ', numberOfDots);
    if (numberOfDots > 0) {
        if (numberOfDots > 1) {
            return false;
        } else {

        }
    }
    return isValid;
}