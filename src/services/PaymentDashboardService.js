import rp from 'request-promise';
import URL from '../constants/URLConstants.js';
import _ from 'underscore';
import moment from 'moment';
import PDAction from '../actions/PaymentDashboardActions';
import Toaster from 'toastr';
import AuthService from './AuthService';

class PaymentDashboardService {
    fetchAllPayments(params) {
        params.start_date = moment(params.start_date).format('YYYY-MM-DD')
        let options = {
            uri: URL.PAYMENTS.ALL,
            method: 'POST',
            json: true,
            body: params,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            }
        }
        rp(options).then((data)=> {
            window.data = data;
            if (!_.isNull(data) && !_.isUndefined(data.data) && !_.isNull(data.data)) {
                PDAction.updatPaymentsList(data.data);
            }
            Promise.resolve();
        }).catch((error)=> {
            if (!_.isNull(error) && !_.isUndefined(error.statusCode) && error.statusCode === 401) {
                AuthService.logout();
            } else {
                Toaster.error('Sorry there was a problem in retrieving the transactions');
                PDAction.updatPaymentsList([]);
                Promise.reject();
            }
        });
    }

    updateOptions(options) {
        PDAction.updateOptions(options);
    }

}

export default new PaymentDashboardService();