import React from 'react';
import './styles.scss';
import _ from 'underscore';
import Moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import isCurrency from 'validator/lib/isCurrency';
import isURL from 'validator/lib/isURL';
import VacancyService from '../../../services/VacancyService';
import PropertyService from '../../../services/PropertiesServices';
import VacancyStore from '../../../stores/VacancyStore';
import PropertyStore from '../../../stores/PropertyStore';
import only from 'only';
import typecast from 'typecast';
import Optimus from  '../../../utility/optimus';
import {handleError, handleSuccess} from '../../../utility/helpers';
const PROPS = {
    local: [
        'weeklyRentMin',
        'weeklyRentMax',
        'reaLink',
        'domainLink',
        'availableDate',
        'listingNotes'
    ],
    server: [
        'weekly_ad_rent_min',
        'weekly_ad_rent_max',
        'rea_link',
        'domain_link',
        'available_date',
        'listing_note',
    ]
};

const ErrorMessage = (props) => {
    let message = '';
    let show = false;
    if (!_.isEmpty(props.validation) && !_.isUndefined(props.validation.errorMessage)) {
        message = props.validation.errorMessage;
    }
    if (!_.isEmpty(props.validation) && !_.isUndefined(props.validation.hasError) && props.validation.hasError === true) {
        show = true;
    }
    if (show === true) {
        return (
            <p className="VAValidation-error">{message}</p>
        )
    } else {
        return null;
    }
};

class ErrorList {
    constructor() {
        this.errorList = [];
    }

    add(type, message){
        this.errorList.push({type, message});
    };

    clear() {
        this.errorList = [];
    }

    get list() {
        return this.errorList;
    }
}

class ResetValidationList {
    constructor() {
        this.resetList = [];
    }

    updateList(newList) {
        this.resetList  = newList;
    }

    add(newItem) {
        this.resetList.push(newItem);
    }

    clear() {
        this.resetList = [];
    }

    get list() {
        return this.resetList;
    }
}

export default class Vacancy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            property_id: Optimus.decode(props.params.id),
            property_address: '',
            value: 'listing',
            hasListing: false,
            weeklyRentMin: '',
            weeklyRentMax: '',
            availableDate: null,
            reaLink: '',
            domainLink: '',
            listingNotes: '',
            edit: false,
            classNames: {
                labelWrapper: 'VALabel',
                labelText: 'VALabel__text',
                inputWrapper: 'VAInput'
            },
            validation: {
                weeklyRent: {
                    hasError: false,
                    errorMessage: 'test'
                },
                availableDate: {
                    hasError: false,
                    errorMessage: 'test'
                },
                reaLink: {
                    hasError: false,
                    errorMessage: 'test'
                },
                domainLink: {
                    hasError: false,
                    errorMessage: 'test'
                },
                listingNotes: {
                    hasError: false,
                    errorMessage: 'test'
                }
            }
        };
        this.bindMethods = this.bindMethods.bind(this);
        this.bindMethods(
            [
                'handleClickCancel',
                'handleClickSave',
                'handleClickEdit',
                'addListing',
                'removeListing',
                'handleChangeWeeklyRent',
                'resetValidation',
                'fetchVacancy',
                'updateFromStore',
                'resetState',
                'updatePrevState',
                'fetchProperty',
                'handleDoneEditingForm',
                'prefillNotes'
            ]
        );
        this.errors = new ErrorList();
        this.resetList = new ResetValidationList();
        this.updatePrevState();
    }

    updatePrevState() {
        let props = [
            'weeklyRentMin',
            'weeklyRentMax',
            'availableDate',
            'reaLink',
            'domainLink',
            'listingNotes'
        ];
        this._prev_state = only(this.state, 'weeklyRentMax weeklyRentMin availableDate reaLink domainLink listingNotes');
        _.each(props, (prop) => {
          if (_.isNull(this.state[prop])) {
              this._prev_state[prop] = null;
          }
        });
    }

    get prevState() {
        return this._prev_state;
    }

    componentDidMount() {
        this.fetchProperty();
        this.fetchVacancy();
        VacancyStore.on('CHANGE', this.updateFromStore)
        PropertyStore.on('change', this.updateFromStore);
        this.prefillNotes();
    }

    componentWillUnmount() {
        VacancyStore.removeListener('CHANGE', this.updateFromStore);
        PropertyStore.removeListener('change', this.updateFromStore);
        this.resetState();
        VacancyStore.reset();
        this.setState({
            hasListing: false
        });
    }

    fetchProperty() {
        PropertyService.findProperty(this.state.property_id)
            .then((res) => {
                if(!_.isUndefined(res.status.data.addr_street_address) && self._mount){
                    this.setState({
                        property_address: res.status.data.addr_street_address
                    });
                }
            });
    }

    resetState() {
        this.setState({
            weeklyRentMin: '',
            weeklyRentMax: '',
            availableDate: null,
            reaLink: '',
            domainLink: '',
            listingNotes: '',
        }, () => {
            this.updatePrevState();
        });
    }

    updateFromStore() {

        if (!_.isNull(PropertyStore.data) && !_.isUndefined(PropertyStore.data.status.data.addr_street_address)) {
            this.setState({
                property_address: PropertyStore.data.status.data.addr_street_address
            });
        }

        let data = {
            id: VacancyStore.id
        };

        if (!_.isNull(VacancyStore.hasListing)) {
            data.hasListing = VacancyStore.hasListing;
        }
        if (!_.isNull(VacancyStore.weeklyRentMin)) {
            data.weeklyRentMin = VacancyStore.weeklyRentMin;
        }
        if (!_.isNull(VacancyStore.weeklyRentMax) || VacancyStore.weeklyRentMax !== this.state.weeklyRentMax) {
            data.weeklyRentMax = VacancyStore.weeklyRentMax;
        }
        if (!_.isNull(VacancyStore.reaLink)) {
            data.reaLink = VacancyStore.reaLink;
        }
        if (!_.isNull(VacancyStore.domainLink)) {
            data.domainLink = VacancyStore.domainLink;
        }
        if (!_.isNull(VacancyStore.listingNotes)) {
            data.listingNotes = VacancyStore.listingNotes;
        }
        if (!_.isNull(VacancyStore.availableDate)) {
            data.availableDate = new Date(VacancyStore.availableDate);
        }
        let that = this;
        this.setState(data, () => {
            that.prefillNotes();
        });
    }

    fetchVacancy() {
        var data = {
            property_id: this.state.property_id
        };
        VacancyService.fetchVacancy(data)
    }

    handleDateChange(date) {
        this.resetList.add('availableDate');
        this.resetValidation();
        this.setState({
            availableDate: date
        });
    }

    handleChangeLink(e, type) {
        let value = typecast(e.target.value, 'string');
        if (['reaLink', 'domainLink'].includes(type)) {
            if (value.length > 8 && !(value.indexOf('http://') > -1 || value.indexOf('https://') > -1)) {
                value = 'http://' + value;
            }
        }
        let state = _.clone(this.state);
        state[type] = value;
        this.resetList.add(type);
        this.resetValidation();
        this.setState(state);
    }

    resetValidation(cb) {
        let validation = only(this.state, 'validation').validation;
        _.each(validation, (item, index) => {
            if (this.resetList.list.includes(index)) {
                item.hasError = false;
                item.errorMessage = '';
            }
        });
        this.resetList.clear();
        this.setState({validation}, cb);

    }


    bindMethods(array) {
        array.forEach((name) => {
            this[name] = this[name].bind(this);
        });
    }

    handleClickCancel() {
        let validation = only(this.state, 'validation').validation;
        _.each(validation, (item, index) => {
            this.resetList.add(index);
        });

        this.setState(this.prevState);
        this.resetValidation();
        this.handleDoneEditingForm();
    }

    handleDoneEditingForm() {
        this.prefillNotes();
        this.setState({
            edit: false
        });
    }

    handleClickEdit() {
        this.updatePrevState();
        this.setState({
            edit: true
        });
    }

    setValidationError() {
        let validation = _.clone(this.state.validation);
        _.each(this.errors.list, (item) => {
            validation[item.type] = {
                hasError: true,
                errorMessage: item.message
                }
            });
        this.setState({
            validation: _.clone(validation)
        });
    }

    handleClickSave() {
        this.resetValidation(() => {
        this.errors.clear();
        let isValid = true;
        let minRent = typecast(this.state.weeklyRentMin, 'number');
        let maxRent = typecast(this.state.weeklyRentMax, 'number');

        if(!_.isEmpty(this.state.reaLink) && !isURL(this.state.reaLink)) {
            this.errors.add('reaLink', 'REA listing link must be a valid url');
            isValid = false;
        }
        if(_.isNull(this.state.availableDate) || _.isEmpty(typecast(this.state.availableDate, 'string'))) {
            this.errors.add('availableDate', 'Availability Date cannot be empty');
            isValid = false;
        }
        if(!_.isEmpty(this.state.domainLink) && !isURL(this.state.domainLink)) {
            this.errors.add('domainLink', 'Domain listing link must be a valid url');
            isValid = false;
        }
        if (minRent === null && maxRent > 0) {
            this.errors.add('weeklyRent', 'Please enter the minimum weekly rent');
        }
        if (maxRent !== null && (minRent >= maxRent)) {
            this.errors.add('weeklyRent', 'Second amount has to be greater than the first');
            isValid = false;
        }
        if (isValid === true) {
           let data = {
               property_id: this.state.property_id,
               vacancy_id: this.state.id,
           };
           if (this.state.availableDate !== '') {
               data.available_date = Moment(this.state.availableDate).format('YYYY-MM-DD');
           }
           if (!_.isEmpty(this.state.domainLink)) {
               data.domain_link= this.state.domainLink;
           }
           if (!_.isEmpty(this.state.reaLink)) {
               data.rea_link= this.state.reaLink;
           }
           if (!_.isEmpty(this.state.weeklyRentMin)) {
               data.weekly_ad_rent_min = this.state.weeklyRentMin;
           }
           if (!_.isEmpty(this.state.weeklyRentMax)) {
               data.weekly_ad_rent_max = this.state.weeklyRentMax;
           }
           if (!_.isEmpty(this.state.listingNotes)) {
              data.listing_note= this.state.listingNotes;
           }

           PROPS.local.forEach((item, index) => {
               // Omit unchanged values
               if (this.prevState[item] === this.state[item]) {
                   data = _.omit(data, PROPS.server[index]);
               }
               // Submitting blank values for removed values;
               if (this.prevState[item] !== '' && this.state[item] === '') {
                   data[PROPS.server[index]] = null;
               }
           });

           VacancyService.updateVacancy(data)
               .then((res) => {
                   handleSuccess(res);
                   this.fetchVacancy();
                   this.setState({
                       edit: false
                   });
               })
               .catch((error) => {
                    handleError(error);
               });
            } else {
                this.setValidationError();
            }
        });
    }

    addListing() {
        let data = {
            property_id: this.state.property_id
        };
        VacancyService.addVacancy(data)
            .then((res) => {
                handleSuccess(res);
                VacancyService.fetchVacancy(data);
                this.setState({
                    hasListing: true,
                    edit: true
                });
            })
            .catch((error) => {
                handleError(error);
            });
    }

    removeListing() {
        let data = {
            property_id: this.state.property_id,
                vacancy_id: this.state.id
        };
        VacancyService.removeVacancy(data)
            .then((res) => {
                handleSuccess(res);
                this.setState({
                    hasListing: false
                });
                this.resetState();
            })
            .catch((error) => {
                handleError(error);
            });
    }

    renderNewUi(){
        return (
            <div className="DA-PropertySection">
                <div>
                    <div className="DA-PropertySection__heading">
                        <h1>1234 Proudfoot Drive
                            <span className="oval"></span>
                            Listing Details
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    handleChange(value) {
        this.setState({
            value
        });
    }

    renderNoListing() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <p className="VATitle pre-icon-minus-circle"><span className="TOTitle__main TOTitle__main--amber TOTitle__main--p7">This property is not available to let</span></p>
                    <span className="linkButton" onClick={this.addListing}>
                        List Property
                    </span>
                </div>
            </div>
        );
    }

    handleChangeWeeklyRent(e, type) {
        this.resetList.add('weeklyRent');
        this.resetValidation();
        let value = e.target.value;
        let data = {};
        if((isCurrency(value) || _.isEmpty(value)) && value < 99999999 && value >= 0) {
            data[type] = value;
            this.setState(data);
        }
    }

    renderWeeklyRent() {
        let minRent = this.state.weeklyRentMin;
        let maxRent = this.state.weeklyRentMax;
        let rentText = '';
        if (_.isNull(minRent)) {
            minRent = '';
        }
        if (_.isNull(maxRent)) {
            maxRent = '';
        }
        maxRent += '';
        minRent += '';

        if (!_.isEmpty(maxRent) && !_.isEmpty(minRent)) {
            rentText = '$' + minRent + ' - $' + maxRent;
        } else if (!_.isEmpty(minRent) && _.isEmpty(maxRent)) {
            rentText = '$' + minRent;
        } else if(!_.isEmpty(maxRent) && _.isEmpty(minRent)) {
            rentText = '$' + maxRent;
        }

        return(
            <div>
                <div className="VARow">
                    <div className={this.state.classNames.labelWrapper}>
                        <label className={this.state.classNames.labelText} htmlFor="">Advertised weekly rent</label>
                    </div>
                    {this.state.edit ? <div className={this.state.classNames.inputWrapper}>
                        <div className="VALabeledInput VALabeledInput--icon-dollar">
                            <input onChange={(e) => this.handleChangeWeeklyRent(e, 'weeklyRentMin')}
                                   value={minRent}
                                   className="VALabeledInput__input"
                                   type="text"/>
                        </div>
                        <div className="VARentDash">-</div>
                        <div className="VALabeledInput VALabeledInput--icon-dollar">
                            <input onChange={(e) => this.handleChangeWeeklyRent(e, 'weeklyRentMax')}
                                   value={maxRent}
                                   className="VALabeledInput__input"
                                   type="text"/>
                        </div>
                    </div> : <p className="VADisplayText">{rentText}</p>}
                </div>
                <div className="VARow VARow--validation">
                    <ErrorMessage
                        validation={this.state.validation.weeklyRent}/>
                </div>
            </div>
        );
    }

    renderAvailableDates() {
        const datePickerInputStyles = {
            'marginLeft': '35px',
            'opacity': '0.8',
            'color': '#000',
            'fontFamily': 'muli',
            'fontSize': '16px',
            'fontWeight': '400'
        };

        const timePickerTextStyles = {
            'width': '110px'
        };

        const datePickerTextStyles = {
            'minWidth': '170px',
            'width': 'auto'
        };

        const pickerRootStyle = {
            'display': 'inline-block'
        };

        let datePickerProps = {
            autoOk: true,
            style: pickerRootStyle,
            value: this.state.availableDate,
            hintText: "",
            id: "date-picker",
            textFieldStyle: datePickerTextStyles,
            inputStyle: datePickerInputStyles
        };

        let date = '';
        if (!_.isNull(this.state.availableDate)) {
            date  = Moment(this.state.availableDate).format('DD MMM, YY');
        }

        return(
            <div>
                <div className="VARow">
                    <div className={this.state.classNames.labelWrapper}>
                        <label className={this.state.classNames.labelText} htmlFor="">Availability Date</label>
                    </div>
                    {this.state.edit ? <div className={this.state.classNames.inputWrapper}>
                        <DatePicker
                            {...datePickerProps}
                            formatDate={(date) => {return Moment(date).format('MMM DD, YYYY')}}
                            onChange={(data, date) => this.handleDateChange(date)}
                            className="VA-date-picker"
                          />

                    </div> : <div className="VAInput">
                                <p className="VADisplayText">
                                    {date}
                                </p>
                            </div>
                    }
                </div>
                <div className="VARow VARow--validation">
                    <ErrorMessage
                        validation={this.state.validation.availableDate}/>
                </div>
            </div>
        );
    }

    renderREAListingLink() {
        let link = this.state.reaLink;
        return(
            <div>
                <div className="VARow">
                    <div className={this.state.classNames.labelWrapper}>
                        <label className={this.state.classNames.labelText} htmlFor="">REA Listing Link</label>
                    </div>
                    {this.state.edit ? <div className={this.state.classNames.inputWrapper}>
                        <div className="VALabeledInput VALabeledInput--http VALabeledInput--icon-link">
                            <input
                                className="VALabeledInput__input"
                                onChange={(e) => this.handleChangeLink(e, 'reaLink')}
                                value={link}
                                type="text"/>
                        </div>
                    </div> :
                        <div className="VAInput">
                            <p className="VADisplayText">
                                <a className="VAlink" target="_blank" href={link}>{link}</a>
                            </p>
                        </div>
                    }
                </div>
                <div className="VARow VARow--validation">
                    <ErrorMessage
                        validation={this.state.validation.reaLink}/>
                </div>
            </div>
        );
    }

    renderDomainListingLink() {
        let link = this.state.domainLink;
        return(
            <div>
                <div className="VARow">
                    <div className={this.state.classNames.labelWrapper}>
                        <label className={this.state.classNames.labelText} htmlFor="">Domain Listing Link</label>
                    </div>
                    {this.state.edit ? <div className={this.state.classNames.inputWrapper}>
                        <div className="VALabeledInput VALabeledInput--http VALabeledInput--icon-link">
                            <input
                                className="VALabeledInput__input"
                                onChange={(e) => this.handleChangeLink(e, 'domainLink')}
                                value={link}
                                type="text"/>
                        </div>
                    </div> : <div className="VAInput">
                        <p className="VADisplayText">
                            <a className="VAlink" target="_blank" href={link}>{link}</a>
                        </p>
                    </div>
                    }
                </div>
                <div className="VARow VARow--validation">
                    <ErrorMessage
                        validation={this.state.validation.domainLink}/>
                </div>
            </div>
        );
    }

    prefillNotes() {
        console.log('prefilling notes');
        let notes = "Keys: \n" +
            "Access notes: \n" +
            "Lease term: \n" +
            "Furnished: Yes or No \n" +
            "Pets: Yes or No \n" +
            "Vacant/occupied, if occupied - contact details \n" +
            "Parking: ";
        if (this.state.listingNotes === '') {
            this.setState({
                listingNotes: notes
            });
        }
    }

    renderNotesInput() {
        let note = this.state.listingNotes;

        return(
            <div>
                <div className="VATableRow">
                    <div className={this.state.classNames.labelWrapper}>
                        <label className={this.state.classNames.labelText} htmlFor="">Listing Notes</label>
                    </div>
                    {this.state.edit ? <div className={this.state.classNames.inputWrapper}>
                        <textarea
                            className="VANote"
                            onChange={(e) => this.handleChangeLink(e, 'listingNotes')}
                            value={note}/>
                    </div>
                    :  <div className="VAInput VAInput--listing-note">
                        <pre className="VADisplayText VADisplayText--pre">
                            {note}
                        </pre>
                    </div>}
                </div>
                <div className="VARow VARow--validation">
                    <ErrorMessage
                        validation={this.state.validation.listingNotes}/>
                </div>
            </div>
        );
    }

    renderHasListing() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <p className="VATitle"><span className="TOTitle__main TOTitle__main--p7">This property is available to let</span></p>
                        {!this.state.edit && <span className="linkButton" onClick={this.removeListing}>
                            Mark Leased
                        </span>}
                    </div>
                </div>
                <div className="VAInputs">
                    {this.renderWeeklyRent()}
                    {this.renderAvailableDates()}
                    {this.renderREAListingLink()}
                    {this.renderDomainListingLink()}
                    {this.renderNotesInput()}
                </div>
                <div className="row VAButtonRow">
                    {this.state.edit ? <div className="col-xs-12">
                        <button className="button bill-button" onClick={this.handleClickCancel}>Cancel</button>
                        <button className="button button_main bill-button" onClick={this.handleClickSave}>Save</button>
                    </div> : <div className="col-xs-12">
                            <button className="button button_main bill-button" onClick={this.handleClickEdit}>Edit</button>
                        </div>}
                </div>
            </div>
        )
    }

    renderVacancy() {
        return (
            <div className="propertySection__content">
                <div className="row col-xs-12 propertyTabContainer">
                    <div className={this.state.value == "listing" ? 'propertyTab--active propertyTab' : 'propertyTab'}
                         onClick={() => this.handleChange("listing")}>
                        Listing Details
                    </div>
                    <div className={this.state.value == "image" ? 'propertyTab--active propertyTab' : 'propertyTab'}
                         onClick={() => this.handleChange("image")}>
                        Images
                    </div>
                </div>
                {this.state.hasListing ? this.renderHasListing() : this.renderNoListing() }
            </div>
        );
    }

    renderImages() {
        return (
            <div className="propertySection__content">
                <div className="row col-xs-12 propertyTabContainer">
                    <div className={this.state.value == "listing" ? 'propertyTab--active propertyTab' : 'propertyTab'}
                         onClick={() => this.handleChange("listing")}>
                        Listing Details
                    </div>
                    <div className={this.state.value == "image" ? 'propertyTab--active propertyTab' : 'propertyTab'}
                         onClick={() => this.handleChange("image")}>
                        Images
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let viewPort = null;
        switch(this.state.value) {
            case 'listing':
                viewPort = this.renderVacancy();
                break;
            case 'image':
                viewPort = this.renderImages();
                break;
            default:
                break;
        }

        return (
            <div className="admin-padding-adjustment add-person-form-ta people-tab">
                <div className="section-header">
                    <h1>{this.state.property_address}<i className="oval"/>
                        <span className="document">VACANCY</span>
                    </h1>
                </div>
                {viewPort}
            </div>
        );
    }
}