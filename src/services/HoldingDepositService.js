import rp from 'request-promise';
import URL from '../constants/URLConstants.js';
import HoldingDepositAction from '../actions/HoldingDepositActions';
import HoldingDepositStore from '../stores/HoldingDepositStore';

class HoldingDepositService {
    submitPayment() {
        let data = HoldingDepositStore.form_data;
        let requestOptions = {
            method: 'POST',
            uri: URL.HOLINDG_DEPOSIT,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };
        return rp(requestOptions);
    }

    changeInfo(data) {
        HoldingDepositAction.holdingDepositChanged(data);
    }
}

export default new HoldingDepositService();