import URL from '../constants/URLConstants.js';
import request from 'reqwest';
import when from 'when';
import Toastr from 'toastr';
import TakeoverAction from '../actions/TakeoverAction';
import AuthService from '../services/AuthService';
import LoginStore from '../stores/LoginStore';
import _ from 'underscore';
import {cloneObject} from '../utility/helpers';
import TakeoverStore from '../stores/TakeoverStore';

class TakeoverService {

    fetchTakeoverInfo(property_id, options) {
        let localOptions = {};
        if (!_.isUndefined(options)) {
            localOptions  = options;
        }
        return this.handleFetch(when(request({
            url: URL.TAKEOVER + '/' + property_id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json'
        })), localOptions);
    }

    updateCheckItem(data) {
        const payload = {};
        let options = {};
        if (!_.isUndefined(data.options)) {
            options = data.options;
            delete data.options;
        }

        payload.property_id = data.property_id;
        if (data.status === true) {
            data.status = 1;
        } else {
            data.status = 0;
        }
        payload.check_list_id = data.check_list_id;

        return this.handleUpdateCheckItem(when(request({
            url: URL.TAKEOVER,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: data
        })), options);
    }

    updateBondReference(data) {
        return this.handleUpdateBondReference(when(request({
            url: URL.TAKEOVER_BOND_REFERENCE,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: data
        })));
    }

    updateTenantInspection(data) {
        let method = 'POST';
        if (!_.isUndefined(data.options) && !_.isUndefined(data.options.update) && data.options.update === true) {
            method = 'PUT';
            delete data.property_tenancy_id;
        }
        delete data.options;
        return this.handleAddTenantInspection(when(request({
            url: URL.TAKEOVER_TENANT_INSPECTION,
            method,
            crossOrigin: true,
            headers: {
                'Authorization': LoginStore.jwt
            },
            type: 'json',
            data: data
        })), data);
    }

    uploadDocument(data) {
        let callAction = (res) => {
            if (!_.isUndefined(res.data)) {
                if (!_.isUndefined(res.data.id)) {
                    data.new_document_id = res.data.id;
                }
                if (!_.isUndefined(res.data.file_name)) {
                    data.new_document_file_name = res.data.file_name;
                }
            }
            TakeoverAction.uploadedDocument(data);
        };

        let getMethod = ()=> {
            if (data.replace === true) {
                return 'PUT';
            } else {
                return 'POST';
            }
        };

        return new Promise(function (resolve, reject) {
            let formData = new FormData();
            if (!_.isUndefined(data.property_id)) {
                formData.append('property_id', data.property_id);
            }
            if (!_.isUndefined(data.PDF_1)) {
                formData.append('PDF_1', data.PDF_1);
            }
            if (!_.isUndefined(data.IMG_1)) {
                formData.append('IMG_1', data.IMG_1);
            }
            if (!_.isUndefined(data.category_id)) {
                formData.append('category_id', data.category_id);
            }
            try {
                let xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(getMethod(), URL.TAKEOVER_DOCUMENT);
                xhr.setRequestHeader("Authorization", localStorage.getItem('jwt'));
                xhr.send(formData);
                xhr.addEventListener('readystatechange', function() {
                    if (this.readyState === 4) {
                        if (this.status >= 200 && this.status < 300) {
                            callAction(JSON.parse(this.responseText));
                            resolve(JSON.parse(this.responseText));
                        } else {
                            try {
                                let res = JSON.parse(this.responseText);
                                if (!_.isUndefined(res.status.message)) {
                                    Toastr.error(res.status.message);
                                }
                                reject(JSON.parse(this.responseText));
                            } catch(error) {
                                Toastr.error('Something went wrong, please try uploading again');
                            }
                        }
                    }
                });
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };
            } catch (error) {
                Toastr.error('Something went wrong, please try uploading again');
            }
        });
    }

    removeDocument(data) {
        let payload = {
            property_id: data.property_id,
            category_id: data.category_id
        };
        try {
            return this.handleRemoveDocument(when(request({
                url: URL.TAKEOVER_DOCUMENT,
                method: 'DELETE',
                crossOrigin: true,
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                },
                type: 'json',
                data: payload
            })), data);
        } catch (e) {
            Toastr.error('Something went wrong, please try deleting again');
        }
    }

    handleRemoveDocument(documentPromise, data) {
        documentPromise
            .then((res) => {
                TakeoverAction.removeDocument(data);
            })
            .catch((error) => {});

        return documentPromise;
    }

    handleAddTenantInspection(tenantInspectionPromise, data) {
        tenantInspectionPromise
            .then((res) => {
                if (!_.isUndefined(res.status.code) && !_.isUndefined(res.status.message)) {
                    Toastr.success(res.status.message);
                    TakeoverAction.changeTenantInspectionDate(data)
                    this.fetchTakeoverInfo(TakeoverStore.propertyId);
                }
            })
            .catch((error) => {
                this.handleError(error);
            });
        return tenantInspectionPromise;
    }

    handleUpdateBondReference(bondRefPromise) {
        bondRefPromise
            .then((res) => {
                if (!_.isUndefined(res.status.code) && !_.isUndefined(res.status.message)) {
                    Toastr.success(res.status.message);
                }
            })
            .catch((error) => {
                this.handleError(error);
            });

        return bondRefPromise
    }

    handleError(error) {
        let response = null;
        if (!_.isUndefined(error.response)) {
            response = JSON.parse(error.response);
        }
        if (!_.isNull(response) && !_.isUndefined(response.status.message)) {
            Toastr.error(response.status.message);
        } else {
            Toastr.error('Something went wrong, please try again');
        }
    }

    handleUpdateCheckItem(checkItemPromise, options) {
        let checkListItem = options.item;
        let errorAction = 'checking';
        if (options.item.item_status === 0) {
            errorAction = 'unchecking';
        }
        let errorMessage = `Something went wrong while ${errorAction} "${options.item.list_item}".`;
        checkItemPromise
            .then((res) => {
                // TODO: Remove refetch attribute after take over implementation if not required
                if (!_.isUndefined(options.refetch) && options.refetch === true) {
                    this.fetchTakeoverInfo(TakeoverStore.propertyId);
                }
                if (!_.isUndefined(options.fetchMails) && options.fetchMails === true) {
                    let options = {
                        setMails: true
                    };
                    this.fetchTakeoverInfo(TakeoverStore.propertyId, options);
                }
                TakeoverAction.changeCheckboxStatus(checkListItem);
                if(!_.isUndefined(res.data) && !_.isNull(res.data) & !_.isUndefined(res.data.percentage)) {
                    TakeoverAction.updatePercentage(res.data);
                }
            })
            .catch((error) => {
            console.log(error);
                this.fetchTakeoverInfo(TakeoverStore.propertyId);
                try {
                    if (!_.isUndefined(error.status) && !_.isUndefined(error.response)) {
                        switch (error.status) {
                            case 401:
                                AuthService.logout();
                                break;
                            default:
                                let res = JSON.parse(error.response)
                                if (!_.isUndefined(res.status.message)) {
                                    Toastr.error(res.status.message);
                                } else {
                                    Toastr.error(errorMessage);
                                }
                                TakeoverStore.emit('change');
                                break;
                        }
                    } else {
                        Toastr.error(errorMessage);
                        TakeoverStore.emit('change');
                    }
                } catch(error) {
                    Toastr.error(errorMessage);
                    TakeoverStore.emit('change');
                }
            });
    }

    handleFetch(takeoverPromise, options) {
        takeoverPromise
            .then((res) => {
                if (!_.isUndefined(options.setMails) && options.setMails === true && !_.isUndefined(res.data)) {
                    TakeoverAction.updateMails(res.data);
                } else if (res.status.code === 200) {
                    TakeoverAction.updateInfo(res.data);
                } else {
                    Toastr.error(res.status.message);
                }
            })
            .catch((error) => {
                if (!_.isUndefined(error.status) && !_.isUndefined(error.response)) {
                    switch (error.status) {
                        case 768:
                        case 767:
                            TakeoverAction.updateErrorMessage(JSON.parse(error.response));
                            break;
                        case 401:
                            AuthService.logout();
                            break;
                        default:
                            let res = JSON.parse(error.response);
                            if (!_.isUndefined(res.status.message)) {
                                Toastr.error(res.status.message);
                            } else {
                                Toastr.error('Something went wrong, please contact administrator');
                            }
                            break;
                    }
                } else {
                    Toastr.error('Something went wrong');
                }
            });

        return takeoverPromise;
    }
}

export default new TakeoverService();