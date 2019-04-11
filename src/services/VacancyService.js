import URL from '../constants/URLConstants.js';
import request from 'reqwest';
import when from 'when';
import Toastr from 'toastr'
import VacancyAction from '../actions/VacancyAction';
import _ from 'underscore';
import only from 'only';
import requestPromise from 'request-promise';
import {makeErrorPromise, handleError, handleSuccess} from '../utility/helpers';

class VacancyService {
    addVacancy(data) {
        if (_.isUndefined(data.property_id) || _.isNull(data.property_id)) {
            Toastr.error('Property ID is required');
            return new Promise((resolve) => {
                resolve(null);
            });
        } else {
            let payLoad = only(data, 'property_id');
            return this.handleAddVacancy(when(request({
                url: URL.VACANCY,
                method: 'POST',
                crossOrigin: true,
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                },
                type: 'json',
                data: data
            })), data);
        }
    }

    updateVacancy(data) {
        let requestOptions = {
            method: 'PUT',
            uri: URL.VACANCY,
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('jwt')
            },
            body: data,
            json: true
        };
        return requestPromise(requestOptions);
    }

    removeVacancy(data) {
        if (_.isUndefined(data.property_id) || _.isNull(data.property_id)) {
            return makeErrorPromise('Property ID is required');
        } else if (_.isUndefined(data.vacancy_id) || _.isNull(data.vacancy_id)) {
            return makeErrorPromise('Vacancy ID is required');
        } else {
            let payLoad = only(data, 'property_id', 'vacancy_id');
            return this.handleDeleteVacancy(when(request({
                url: URL.VACANCY,
                method: 'DELETE',
                crossOrigin: true,
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                },
                type: 'json',
                data: data
            })));
        }
    }

    fetchVacancy(data) {
        if (_.isUndefined(data.property_id) || _.isNull(data.property_id)) {
            return makeErrorPromise('Property ID is required');
        } else {
            return this.handleFetchVacancy(when(request({
                url: URL.VACANCY + data.property_id,
                method: 'GET',
                crossOrigin: true,
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                },
                type: 'json'
            })));
        }
    }

    handleDeleteVacancy(vacancyPromise) {
        return vacancyPromise;
    }

    handleFetchVacancy(vacancyPromise) {
        vacancyPromise
            .then((res) => {
                if (!_.isUndefined(res.data)) {
                    VacancyAction.fetchVacancy(res.data);
                }
            })
            .catch((error) => {
                handleError(error);
              });
    }

    handleAddVacancy(vacancyPromise, data) {
        return vacancyPromise;
    }

}

export default new VacancyService();