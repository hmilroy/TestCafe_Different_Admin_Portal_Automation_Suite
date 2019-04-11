import EVENTS from '../constants/eventsConstants.js';
import BaseStore from './BaseStore';
import _ from 'underscore';

class VacancyStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(() => this._registerToAction.bind(this));
        this._id = '';
        this._availableDate = null;
        this._weeklyRentMin = '';
        this._weeklyRentMax = '';
        this._reaLink = '';
        this._domainLink = '';
        this._listingNotes = '';
        this._hasListing = false;
    }

    _registerToAction(action) {
        switch (action.actionType) {
            case EVENTS.FETCH_VACANCY:
                if (_.isNull(action.data)) {
                    this._hasListing = false;
                } else {
                    this._hasListing = true;
                    this._id = action.data.id;
                    this._availableDate = action.data.available_date;
                    this._weeklyRentMax = action.data.weekly_ad_rent_max;
                    this._weeklyRentMin = action.data.weekly_ad_rent_min;
                    this._reaLink = action.data.rea_link;
                    this._domainLink = action.data.domain_link;
                    this._listingNotes = action.data.listing_note;
                }
                this.emit('CHANGE');
            default:
                break;
        }
    }

    reset() {
        this._id = '';
        this._availableDate = null;
        this._weeklyRentMin = '';
        this._weeklyRentMax = '';
        this._reaLink = '';
        this._domainLink = '';
        this._listingNotes = '';
        this._hasListing = false;
    }

    get id () {
        return this._id;
    }

    get availableDate() {
        return this._availableDate;
    }

    get weeklyRentMin() {
        return this._weeklyRentMin;
    }

    get weeklyRentMax() {
        return this._weeklyRentMax;
    }

    get reaLink() {
        return this._reaLink;
    }

    get domainLink() {
        return this._domainLink;
    }

    get listingNotes() {
        return this._listingNotes;
    }

    get hasListing() {
        return this._hasListing;
    }
}

export default new VacancyStore();