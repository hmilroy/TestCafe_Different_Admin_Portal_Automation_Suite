import request from 'reqwest';
import when from 'when';

const UserTypes = '../../data/usertypes.json';
const TradieCategory = '../../data/tradiecategory.json';

class UserService {

    getTypes() {
        return this.handleRequest(when(request({
            url: UserTypes,
            method: 'GET',
            crossOrigin: true,
            type: 'json'
        })));
    }

    getTradieCategory() {
        return this.handleRequest(when(request({
            url: TradieCategory,
            method: 'GET',
            crossOrigin: true,
            type: 'json'
        })));
    }

    handleRequest(promise) {
        return promise;
    }
}

export default new UserService()