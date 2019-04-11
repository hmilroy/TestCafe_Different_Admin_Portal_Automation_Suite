import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import _ from 'underscore';
import BillsAction from '../actions/BillsAction.js';

class BillsService {
    fetchBills(property_id) {
        return this.handleFetchBillsRequest(when(request({
            url: URL.RECURRING_BILLS + property_id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json'
        })));
    }

    updateBills(data) {
        let added_bills = [];
        let removed_bills = [];
        let bills = _.clone(data.bills);
        _(bills).each((bill, index) => {
            if (bill.active) {
                let newBill = {
                    'bill_type': bill.bill_type
                };
                if (bill.email) {
                    newBill['email'] = bill.email;
                }
                added_bills.push(newBill);
            } else {
                removed_bills.push({
                    'bill_type': bill.bill_type
                });
            }
        });
        let payload = {
            'property_id': data.propertyId,
            'added_bills': JSON.stringify(added_bills),
            'removed_bills': JSON.stringify(removed_bills),
        };

        return this.handleUpdateBillsRequest(when(request({
            url: URL.RECURRING_BILLS,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            data: payload,
            type: 'json'
        })), payload);
    }

    handleFetchBillsRequest(promise) {
        promise.then((res) => {
            if (!_.isUndefined(res.data)) {
                BillsAction.fetchBills(res);
            }
        });

        return promise;
    }

    handleUpdateBillsRequest(promise, data) {
        BillsAction.updateBills(data);
        return promise;
    }
}

export default new BillsService();