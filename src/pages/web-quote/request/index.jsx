import React from 'react';
import {Header} from '../layout/index.jsx';
import Gallery from 'react-grid-gallery';
import TextField from 'material-ui/TextField';
import Toastr from 'toastr';

import MaintenanceService from '../../../services/MaintenanceService';
import QuoteStore from '../../../stores/QuoteStore';


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

export class QuoteRequest extends React.Component {
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
            labour: '',
            otherField: '',
            otherFieldCost: '',
            note: '',
            total: 0,
            images: [],
            nameError: '',
            partsError: '',
            labourError: '',
            disabled: false
        };

        this.onNameChange = this.onNameChange.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
        this.onPartChange = this.onPartChange.bind(this);
        this.onLabourChange = this.onLabourChange.bind(this);
        this.onOtherCostChange = this.onOtherCostChange.bind(this);
        this.onOtherFieldChange = this.onOtherFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        MaintenanceService.getQuoteDetals(QuoteStore.hash)
            .then( result => {
                let images = [];
                result.data.mediaFiles.images.map( value => {
                    let image = {
                        src: value,
                        thumbnail: value,
                        thumbnailWidth: 148,
                        thumbnailHeight: 120,
                        caption: "Maintenance Client Image"
                    };
                    images.push(image);
                });
                this.setState({
                    problemSpace: result.data.problemArea,
                    problem: result.data.problem,
                    description: result.data.description,
                    images: images,
                    company: result.data.tradie.company
                });

                if(result.data.quoteSubmitted) {
                    this.setState({
                        name: result.data.quoteInfo.name,
                        parts: result.data.quoteInfo.partsQuote,
                        labour: result.data.quoteInfo.labourQuote,
                        otherField: result.data.quoteInfo.otherQuoteName,
                        otherFieldCost: result.data.quoteInfo.otherQuote,
                        note: result.data.quoteInfo.note,
                        total: result.data.quoteInfo.totalQuote,
                        disabled: true
                    })
                }
            })
    }

    onNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    onNoteChange(event) {
        this.setState({
            note: event.target.value
        });
    }

    onOtherFieldChange(event) {
        this.setState({
            otherField: event.target.value
        });
    }

    onPartChange(event) {
        this.setState({
            parts: event.target.value,
            total: parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.labour ? this.state.labour : 0)
            + parseFloat(this.state.otherFieldCost ? this.state.otherFieldCost : 0)
        });
    }

    onLabourChange(event) {
        this.setState({
            labour: event.target.value,
            total: parseFloat(this.state.parts ? this.state.parts : 0)
            + parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.otherFieldCost ? this.state.otherFieldCost : 0)
        });
    }

    onOtherCostChange(event) {
        this.setState({
            otherFieldCost: event.target.value,
            total: parseFloat(this.state.parts ? this.state.parts : 0)
            + parseFloat(event.target.value ? event.target.value : 0)
            + parseFloat(this.state.labour ? this.state.labour : 0)
        });
    }

    onSubmit(){
        let nameError = '';
        let partsError = '';
        let labourError = '';
        let noError = true;
        if(!this.state.name) {
            nameError = 'This field is required';
            noError = false;
        }
        if(!this.state.labour) {
            labourError = 'This field is required';
            noError = false;
        }
        if(!this.state.parts) {
            partsError = 'This field is required';
            noError = false;
        }

        this.setState(
            {
                nameError: nameError,
                labourError: labourError,
                partsError: partsError
            }
        );

        if(noError) {
            let data = {};
            if (this.state.otherField && this.state.otherFieldCost) {
                data = {
                    identifier: QuoteStore.hash,
                    name: this.state.name,
                    parts_quote: this.state.parts,
                    labour_quote: this.state.labour,
                    other_quote_name: this.state.otherField,
                    other_quote: this.state.otherFieldCost
                };
            } else {
                data = {
                    identifier: QuoteStore.hash,
                    name: this.state.name,
                    parts_quote: this.state.parts,
                    labour_quote: this.state.labour
                };
            }

            MaintenanceService.putQuoteDetails(data)
                .then(value => {
                    this.setState({
                        disabled: true
                    });
                    Toastr.options.positionClass="toast-top-center";
                    Toastr.info(value.status.message);
                })
                .catch(error => {
                    Toastr.options.positionClass="toast-top-center";
                    Toastr.error(JSON.parse(error.response).status.message);
                })

        }
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="web-quote row">
                    <div className="container request">
                        <div className="row">
                            <div className="col-xs-12 col-md-7">
                                <div className="boxed-content maintenance-detail">
                                    <h1>{this.state.problemSpace} {this.state.problem}</h1>
                                    <p>{this.state.description}</p>
                                    <Gallery images={this.state.images}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-5">
                                <div className="boxed-content maintenance-quotation">
                                    <h1>Quote for {this.state.company}</h1>
                                    <div className="row field-row">
                                        <div className="col-xs-12 col-md-6 field-input">
                                            <TextField
                                                name="name"
                                                floatingLabelText="Name"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                floatingLabelStyle={STYLES.floatingLabelStyle}
                                                floatingLabelFocusStyle={STYLES.floatingLabelFocusStyle}
                                                inputStyle={STYLES.inputStyle}
                                                value={this.state.name}
                                                onChange={this.onNameChange}
                                                fullWidth={true}
                                                errorText={this.state.nameError}
                                                errorStyle={STYLES.errorStyle}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-6 field-label">
                                            Parts<span>*</span>
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-5 field-input">
                                            <TextField
                                                name="parts"
                                                type="number"
                                                className="no-spin"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.parts}
                                                onChange={this.onPartChange}
                                                errorText={this.state.partsError}
                                                errorStyle={STYLES.errorStyleExtra}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6 gst-text">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-6 field-label">
                                            Labour<span>*</span>
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-5 field-input">
                                            <TextField
                                                name="labour"
                                                type="number"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.labour}
                                                onChange={this.onLabourChange}
                                                errorText={this.state.labourError}
                                                errorStyle={STYLES.errorStyleExtra}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6 gst-text">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-6 field-label big-screen">
                                            <TextField
                                                name="other-field"
                                                hintText='Others'
                                                hintStyle={STYLES.hintStyle}
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.otherField}
                                                onChange={this.onOtherFieldChange}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6 field-label small-screen">
                                            <TextField
                                                name="other-field"
                                                hintText='Others'
                                                hintStyle={STYLES.largeHintStyle}
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.otherField}
                                                onChange={this.onOtherFieldChange}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-1 dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-5 field-input">
                                            <TextField
                                                name="others"
                                                type="number"
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                style={STYLES.common}
                                                value={this.state.otherFieldCost}
                                                onChange={this.onOtherCostChange}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-6 gst-text other-gst-text">
                                            GST Inclusive
                                        </div>
                                    </div>
                                    <div className="row field-row">
                                        <div className="col-xs-4 field-label total-label">
                                            <b>Total</b>
                                        </div>
                                        <div className="col-xs-1 col-xs-offset-2 total-dollar-sign">
                                            $
                                        </div>
                                        <div className="col-xs-5 total-amount">
                                            <b>{this.state.total}</b>
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
                                                fullWidth={true}
                                                multiLine={true}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                        <div className="col-xs-12 small-screen">
                                            <TextField
                                                name="additional"
                                                hintText='Additional Notes'
                                                hintStyle={STYLES.additionalHintStyleLarge}
                                                underlineFocusStyle={STYLES.underlineFocusStyle}
                                                underlineStyle={STYLES.underlineStyle}
                                                inputStyle={STYLES.inputStyle}
                                                value={this.state.note}
                                                onChange={this.onNoteChange}
                                                fullWidth={true}
                                                multiLine={true}
                                                disabled={this.state.disabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="row field-row save-button-row">
                                        <div className="col-xs-12">
                                            <button className="button save-button" onClick={this.onSubmit}
                                                    disabled={this.state.disabled} type="button"
                                                    value="Submit Quote">Submit Quote</button>
                                        </div>
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