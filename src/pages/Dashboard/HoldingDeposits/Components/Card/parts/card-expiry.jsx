import React from 'react';
import BaseComponent from '../../../../../../components/BaseComponent.jsx';
import {Expiration} from 'react-credit-card-primitives';
import { RenderProps, Validation } from '../../common';
import HdStore from '../../../../../../stores/HoldingDepositStore';
import _ from 'underscore';
import typecast from 'typecast';

const ERRORS = {
    EMPTY: 'Expiry date is required',
    PAST: 'Expiry date can not be a past date',
    DEFAULT: 'Expiry date is invalid'
};
export default class CardExpiry extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            value: '',
            showValidation: false,
            errorMessage: ERRORS.EMPTY
        };
        this._input = null;
        this.bindMethods([
            'handleChange',
            'handleBlur',
            'showValidation'
        ]);
        this._input = null;
    }
    componentDidMount() {
        this._mount = true;
        this._input.addEventListener('blur', this.handleBlur);
        HdStore.on('validated', this.showValidation);
    }
    componentWillUnmount() {
        this._mount = false;
        this._input.removeEventListener('blur', this.handleBlur);
        HdStore.removeListener('validated', this.showValidation);
    }
    showValidation() {
        this.setState({
            showValidation: true
        });
    }

    keepZero(value) {
        let returnValue = value;
        if (value < 10) {
            returnValue = '0' + value;
        }

        return returnValue;
    }

    handleChange(e) {
        let { month, year, rowValue, valid, error } = e;
        let errorMessage = '';
        let value = '';
        if (!_.isUndefined(month) && !_.isUndefined(year)) {
            month = this.keepZero(month);
            year = this.keepZero(year);
            value = typecast(month, 'string') + typecast(year, 'string').substr(2,4);
        }
        if (value === '') {
            errorMessage = ERRORS.EMPTY;
        } else if (error === undefined){
            errorMessage = '';
        } else if (error.indexOf('past') > -1 ) {
            errorMessage = ERRORS.PAST;
        } else {
            errorMessage = ERRORS.DEFAULT;
        }

        this.setState({
            value: value,
            isValid: valid,
            showValidation: false,
            errorMessage: errorMessage
        });
        let data = {
            value: value,
            type: this.props.type,
            valid: valid
        };
        this.props.onChange(data);
    }
    handleBlur() {
        this.setState({
            showValidation: true
        });
    }
    render() {
        // let showValidation = this.state.showValidation && !this.state.isValid;
        let showValidation = this.props.showValidation && !this.state.isValid;

        return (
            <div className={this.props.className}>
                <Expiration
                    onChange={this.handleChange}
                    render={({ getInputProps, value, valid, error, month, year }) => (
                        <div>
                            <input
                                ref={(element) => this._input = element}
                                className="hdCreditCardExpiry hdCreditCard__input"
                                {...getInputProps()} />
                        </div>
                    )} />
                {showValidation && <Validation
                                        text={this.state.errorMessage}
                                        className="hdValidation" />}
            </div>
        );
    }
}