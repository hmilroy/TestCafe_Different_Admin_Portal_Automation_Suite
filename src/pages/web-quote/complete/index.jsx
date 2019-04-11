import React from 'react';
import {Header} from '../layout/index.jsx';
import Gallery from 'react-grid-gallery';
import TextField from 'material-ui/TextField';
import Toastr from 'toastr';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

import Camera from 'material-ui/svg-icons/image/camera-alt';

import MaintenanceService from '../../../services/MaintenanceService';
import QuoteStore from '../../../stores/QuoteStore';
import Dropzone from 'react-dropzone';

import '../webquote.scss';

//Custom Style
const STYLES = {
    common: {
        width: '100%',
        height: 'auto'
    },
    underlineFocusStyle: {
        borderColor: '#379eff',
        bottom: 0
    },
    underlineStyle: {
        borderColor: '#d5d5d5',
        bottom: 0
    },
    floatingLabelStyle: {
        color: '#a1a8ad',
    },
    floatingLabelFocusStyle: {
        color: '#379eff',
    },
    inputStyle: {
        fontSize: '16px'
    },
    hintStyle: {
        color: '#a1a8ad',
        fontSize: '16px',
        lineHeight: '24px',
        bottom: '0'
    },
    largeHintStyle: {
        color: '#a1a8ad',
        fontSize: '42px',
        lineHeight: '46px',
        bottom: '0'
    },
    additionalHintStyle: {
        color: '#a1a8ad',
        fontSize: '16px',
        lineHeight: '24px'
    },
    additionalHintStyleLarge: {
        color: '#a1a8ad',
        fontSize: '42px',
        lineHeight: '46px',
    },
    errorStyle: {
        bottom: 0
    },
    errorStyleExtra: {
        bottom: '-20px'
    }
};

export class QuoteComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lightboxIsOpen: false,
            problemSpace: '',
            problem: '',
            description: '',
            company: '',
            name: '',
            parts: '',
            actualParts: '',
            labour: '',
            actualLabour: '',
            otherField: '',
            otherFieldCost: '',
            actualOther: '',
            note: '',
            actualNote: '',
            total: 0,
            actualTotal: 0,
            images: [],
            uploadImages: [],
            dateError: '',
            timeError: '',
            partsError: '',
            labourError: '',
            addressLine1: '',
            addressLine2: '',
            googleMapAPI: '&key=AIzaSyBz3G5wDT9l1I-yin9HUx19yHTZpEPTReY&q=',
            googleStaticMap: 'https://www.google.com/maps/embed/v1/place?',
            streetAddress: '',
            tenantMail: '',
            tenantPhone: '',
            propertyManagerMail: 'ruwin@different.com.au',
            propertyManagerPhone: '+61 0432 100 151',
            completedDate: new Date(),
            completedTime: null,
            files: null,
            disabled: false
        };

        this.onNameChange = this.onNameChange.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
        this.onPartChange = this.onPartChange.bind(this);
        this.onLabourChange = this.onLabourChange.bind(this);
        this.onOtherCostChange = this.onOtherCostChange.bind(this);
        this.onOtherFieldChange = this.onOtherFieldChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        MaintenanceService.getQuoteDetals(QuoteStore.hash)
            .then(result => {
                let images = [];
                result.data.mediaFiles.images.map(value => {
                    let image = {
                        src: value,
                        thumbnail: value,
                        thumbnailWidth: 148,
                        thumbnailHeight: 120,
                        caption: "Maintenance Client Image"
                    };
                    images.push(image);
                });

                if (result.data.quoteSubmitted) {
                    let address_line_1 = result.data.property.streetAddress
                        .substring(0, result.data.property.streetAddress.indexOf(', ' + result.data.property.suburb));
                    let address_line_2 = result.data.property.suburb + ' ' + result.data.property.state + ', '
                        + result.data.property.postCode;

                    let prefix = result.data.tenant.countryCode == 'LK' ? '+94' : '+61';
                    this.setState({
                        problemSpace: result.data.problemArea,
                        problem: result.data.problem,
                        description: result.data.description,
                        images: images,
                        company: result.data.tradie.company,
                        name: result.data.quoteInfo.name,
                        parts: result.data.quoteInfo.partsQuote,
                        labour: result.data.quoteInfo.labourQuote,
                        otherField: result.data.quoteInfo.otherQuoteName,
                        otherFieldCost: result.data.quoteInfo.otherQuote,
                        note: result.data.quoteInfo.note,
                        total: result.data.quoteInfo.totalQuote,
                        addressLine1: address_line_1,
                        addressLine2: address_line_2,
                        streetAddress: result.data.property.streetAddress,
                        tenantMail: result.data.tenant.email,
                        tenantPhone: prefix + ' ' + result.data.tenant.telNumber
                    })
                }
            })
    }

    onNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    onDateChange(e, date) {
        this.setState({
            completedDate: date
        })
    }

    onTimeChange(e, time) {
        this.setState({
            completedTime: time
        })
    }

    onNoteChange(event) {
        this.setState({
            actualNote: event.target.value
        });
    }

    onOtherFieldChange(event) {
        this.setState({
            otherField: event.target.value
        });
    }

    onPartChange(event) {
        this.setState({
            actualParts: event.target.value,
            actualTotal: parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.actualLabour ? this.state.actualLabour : 0)
            + parseFloat(this.state.actualOther ? this.state.actualOther : 0)
        });
    }

    onLabourChange(event) {
        this.setState({
            actualLabour: event.target.value,
            actualTotal: parseFloat(this.state.actualParts ? this.state.actualParts : 0)
            + parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.actualOther ? this.state.actualOther : 0)
        });
    }

    onOtherCostChange(event) {
        this.setState({
            actualOther: event.target.value,
            actualTotal: parseFloat(this.state.parts ? this.state.parts : 0)
            + parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.actualLabour ? this.state.actualLabour : 0)
        });
    }

    onDrop(e) {
        let files = e.target.files;
        let images = [];
        let value = files[0];
        let image = {
            src: value.name,
            thumbnail: value.name,
            thumbnailWidth: 148,
            thumbnailHeight: 120,
            caption: "Maintenance Complete Image"
        };
        images.push(image);

        this.setState({
            uploadImages: images,
            files: files
        })
    }

    onSubmit() {
        let dateError = '';
        let timeError = '';
        let partsError = '';
        let labourError = '';
        let noError = true;
        if (!this.state.actualParts) {
            labourError = 'This field is required';
            noError = false;
        }
        if (!this.state.actualParts) {
            partsError = 'This field is required';
            noError = false;
        }
        if (!this.state.completedDate) {
            dateError = 'This field is required';
            noError = false;
        }
        if (!this.state.completedTime) {
            timeError = 'This field is required';
            noError = false;
        }

        this.setState(
            {
                dateError: dateError,
                timeError: timeError,
                labourError: labourError,
                partsError: partsError
            }
        );

        if (noError) {
            let data = {
                identifier: QuoteStore.hash,
                parts_cost: this.state.actualParts,
                labour_cost: this.state.actualLabour,
                completed_date: moment(this.state.completedDate).format('YYYY-MM-DD'),
                completed_time: moment(this.state.completedTime).format('HH:MM'),
            };
            if (this.state.actualOther && this.state.otherField) {
                data.other_quote = this.state.actualOther;
                data.other_quote_name = this.state.otherField;
            }

            if (this.state.actualNote) {
                data.note = this.state.actualNote
            }

            if (this.state.files) {
                data.IMG_1 = this.state.files;
            }

            if (MaintenanceService.putQuoteComplete(data)) {
                this.setState({disabled: true});
                Toastr.options.positionClass = "toast-top-center";
                Toastr.info(value.status.message);
            }
            // .then(value => {
            //     this.setState({
            //         disabled: true
            //     });
            //     Toastr.options.positionClass = "toast-top-center";
            //     Toastr.info(value.status.message);
            // })
            // .catch(error => {
            //     Toastr.options.positionClass = "toast-top-center";
            //     Toastr.error(JSON.parse(error.response).status.message);
            // })

        }
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="web-quote row">
                    <div className="container complete">
                        <div className="row">
                            <div className="col-xs-12 upper-section">
                                <div className="row">
                                    <div className="col-xs-12 col-md-7 left-upper">
                                        <div className="row  address-line">
                                            <div className="col-xs-6 col-md-4">
                                                <strong>{this.state.addressLine1}</strong>
                                            </div>
                                            <div className="col-xs-6 col-md-3 right-text">
                                                {this.state.addressLine2}
                                            </div>
                                            <div className="col-md-5 get-direction-text big-screen right-text">
                                                <a target="new" href={'https://www.google.com/maps/place/'
                                                + this.state.streetAddress}>Get Direction</a>
                                            </div>
                                        </div>
                                        <iframe className="row map" width="100%" frameBorder="0" style={{border: 0}}
                                                src={this.state.googleStaticMap +
                                                this.state.googleMapAPI + this.state.streetAddress}
                                                allowFullScreen>
                                        </iframe>
                                    </div>
                                    <div className="col-xs-12 col-md-5 left-padded">
                                        <div className="right-upper">
                                            <div className="row contact-box">
                                                <div className="row col-xs-12 header">
                                                    Tenant Contact Details
                                                </div>
                                                <div className="row col-xs-12">
                                                    <div className="col-xs-6 row content">
                                                        <img className="phone-image"/>
                                                        <a href={'tel://' + this.state.tenantPhone}>
                                                            {this.state.tenantPhone}</a>
                                                    </div>
                                                    <div className="col-xs-6 right-text row content">
                                                        <img className="mail-image"/>
                                                        <a href={'mailto:' + this.state.tenantMail}>
                                                            {this.state.tenantMail}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row contact-box">
                                                <div className="row col-xs-12 header">
                                                    Property Manager Details
                                                </div>
                                                <div className="row col-xs-12">
                                                    <div className="col-xs-6 row content">
                                                        <img className="phone-image"/>
                                                        <a href={'tel://' + this.state.propertyManagerPhone}>
                                                            {this.state.propertyManagerPhone}</a>
                                                    </div>
                                                    <div className="col-xs-6 right-text row content">
                                                        <img className="mail-image"/>
                                                        <a href={'mailto:' + this.state.propertyManagerMail}>
                                                            {this.state.propertyManagerMail}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row item-row">
                            <div className="col-xs-12 col-md-7">
                                <div className="boxed-content maintenance-detail">
                                    <h1>{this.state.problemSpace} {this.state.problem}</h1>
                                    <p>{this.state.description}</p>
                                    <Gallery images={this.state.images}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-5">
                                <div className="boxed-content maintenance-quotation big-screen">
                                    <h1><b>Quote for {this.state.company} :</b> <span>{this.state.name}</span></h1>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            Parts
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            {this.state.parts}
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            Labour
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            {this.state.labour}
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            {this.state.otherField}
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            {this.state.otherFieldCost}
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 col-xs-offset-4 field-label total-label">
                                            <b>Total</b>
                                        </div>
                                        <div className="col-xs-4 total-amount">
                                            $ {this.state.total}
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-12 field-label big-screen">
                                            {this.state.note || ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="boxed-content maintenance-quotation small-screen">
                                    <h1><b>Quote for {this.state.company}</b></h1>
                                    <div className="row field-row cost-area">
                                        <span>{this.state.name}</span>
                                    </div>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-10 field-label">
                                            Parts
                                        </div>
                                        <div className="col-xs-2 dollar-sign">
                                            $ {this.state.parts}
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-10 field-label">
                                            Labour
                                        </div>
                                        <div className="col-xs-2 dollar-sign">
                                            $ {this.state.labour}
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-10 field-label">
                                            {this.state.otherField}
                                        </div>
                                        <div className="col-xs-2 dollar-sign">
                                            $ {this.state.otherFieldCost}
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 col-xs-offset-4 field-label total-label">
                                            $ {this.state.total}
                                        </div>
                                        <div className="col-xs-4 total-amount">
                                            Total
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-12 field-label big-screen">
                                            {this.state.note || ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row item-row">
                            <div className="col-xs-12 col-md-5">
                                <div className="boxed-content maintenance-quotation second-form big-screen third-row">
                                    <h1><b>What was the total cost?</b></h1>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            Parts
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            <TextField
                                                name="parts"
                                                type="number"
                                                className="no-spin"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.actualParts}
                                                onChange={this.onPartChange}
                                                errorText={this.state.partsError}
                                                errorStyle={STYLES.errorStyle}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            Labour
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            <TextField
                                                name="parts"
                                                type="number"
                                                className="no-spin"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.actualLabour}
                                                onChange={this.onLabourChange}
                                                errorText={this.state.partsError}
                                                errorStyle={STYLES.errorStyle}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label">
                                            {this.state.otherField}
                                        </div>
                                        <div className="col-xs-4 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-3 field-label">
                                            <TextField
                                                name="parts"
                                                type="number"
                                                className="no-spin"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.actualOther}
                                                onChange={this.onOtherCostChange}
                                                errorText={this.state.partsError}
                                                errorStyle={STYLES.errorStyle}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 col-xs-offset-4 field-label total-label">
                                            <b>Total</b>
                                        </div>
                                        <div className="col-xs-4 total-amount">
                                            $ {this.state.actualTotal}
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-12 field-label big-screen">
                                            <TextField
                                                name="additional"
                                                hintText='Additional Notes'
                                                hintStyle={STYLES.additionalHintStyle}
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                value={this.state.actualNote}
                                                onChange={this.onNoteChange}
                                                fullWidth={true}
                                                multiLine={true}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="boxed-content maintenance-quotation small-screen">
                                    <h1><b>What was the total cost?</b></h1>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-8 field-label">
                                            Parts
                                        </div>
                                        <div className="col-xs-4 dollar-sign row">
                                            $ <TextField
                                                name="parts"
                                                type="number"
                                                className="no-spin"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.actualParts}
                                                onChange={this.onPartChange}
                                                errorText={this.state.partsError}
                                                errorStyle={STYLES.errorStyle}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-8 field-label">
                                            Labour
                                        </div>
                                        <div className="col-xs-4 dollar-sign">
                                            $ <TextField
                                            name="parts"
                                            type="number"
                                            className="no-spin"
                                            underlineFocusStyle={STYLES.underlineFocusStyle}
                                            underlineStyle={STYLES.underlineStyle}
                                            inputStyle={STYLES.inputStyle}
                                            style={STYLES.common}
                                            value={this.state.actualLabour}
                                            onChange={this.onLabourChange}
                                            errorText={this.state.partsError}
                                            errorStyle={STYLES.errorStyle}
                                            disabled={this.state.disabled}
                                        />
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row cost-area">
                                        <div className="col-xs-8 field-label">
                                            {this.state.otherField}
                                        </div>
                                        <div className="col-xs-4 dollar-sign">
                                            $ <TextField
                                            name="parts"
                                            type="number"
                                            className="no-spin"
                                            underlineFocusStyle={STYLES.underlineFocusStyle}
                                            underlineStyle={STYLES.underlineStyle}
                                            inputStyle={STYLES.inputStyle}
                                            style={STYLES.common}
                                            value={this.state.actualOther}
                                            onChange={this.onOtherCostChange}
                                            errorText={this.state.partsError}
                                            errorStyle={STYLES.errorStyle}
                                            disabled={this.state.disabled}
                                        />
                                        </div>
                                        <div className="col-xs-6 gst-text-complete">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 col-xs-offset-4 field-label total-label">
                                            $ {this.state.actualTotal}
                                        </div>
                                        <div className="col-xs-4 total-amount">
                                            Total
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-12 field-label big-screen">
                                            <TextField
                                                name="additional"
                                                hintText='Additional Notes'
                                                hintStyle={STYLES.additionalHintStyle}
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                value={this.state.actualNote}
                                                onChange={this.onNoteChange}
                                                fullWidth={true}
                                                multiLine={true}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-7">
                                <div className="boxed-content maintenance-detail third-row time-details">
                                    <h1>When was the job completed?</h1>
                                    <div className="row col-xs-12">
                                        <div className="col-xs-6">
                                            <DatePicker
                                                id="1"
                                                hintText="Pick a Date"
                                                value={this.state.completedDate}
                                                onChange={this.onDateChange}
                                                disabled={this.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6">
                                            <TimePicker
                                                hintText="12hr Format"
                                                value={this.state.completedTime}
                                                onChange={this.onTimeChange}
                                                autoOk={true}
                                            />
                                        </div>
                                    </div>
                                    <h1>Add photos & videos of the completed job</h1>
                                    <Gallery images={this.state.uploadImages}/>
                                    <div className="row col-xs-12">
                                        <input className="drop-zone-custom-style" type="file" onChange={this.onDrop}/>
                                    </div>
                                    <div className="float-right-button">
                                        <button className="button save-button" onClick={this.onSubmit}
                                                disabled={this.state.disabled} type="button" value="Submit">Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}