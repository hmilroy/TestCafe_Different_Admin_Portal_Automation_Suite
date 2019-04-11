import request from 'reqwest';
import when from 'when';
import URL from '../constants/URLConstants.js';
import SearchActions from '../actions/SearchActions.js';

class SearchService {

    search(query) {
        return this.handleSearch(when(request({
            url: URL.SEARCH_URL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    handleSearch(searchResultPromise) {
        return searchResultPromise
            .then(function (response) {
                SearchActions.searchResult(response.properties, response.persons);
                return response;
            });
    }

    searchUser(query) {
        return this.handleSearchUser(when(request({
            url: URL.SEARCH_USER,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    handleSearchUser(searchResultPromise) {
        return searchResultPromise
            .then(function (response) {
                return response.data;
            });
    }

    searchProperty(query) {
        return this.handleSearchProperty(when(request({
            url: URL.SEARCH_PROPERTY,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    handleSearchProperty(searchResultPromise) {
        return searchResultPromise
            .then(function (response) {
                return response.data;
            });
    }

    searchAll(query) {
        return this.handleSearchAll(when(request({
            url: URL.SEARCH_ALL,
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': localStorage.getItem('jwt')
            },
            type: 'json',
            data: {
                query
            }
        })));
    }

    handleSearchAll(searchResultPromise) {
        return searchResultPromise
            .then(function (response) {
                SearchActions.searchAllResult(response.data);
                return response;
            });
    }
}

export default new SearchService()
