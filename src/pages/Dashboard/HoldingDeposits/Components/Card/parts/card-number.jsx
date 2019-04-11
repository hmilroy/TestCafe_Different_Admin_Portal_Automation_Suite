import React from 'react';
import BaseComponent from '../../../../../../components/BaseComponent.jsx';
import {Number} from 'react-credit-card-primitives';
import {Validation, RenderProps} from '../../common';
import HdStore from '../../../../../../stores/HoldingDepositStore';

const ERRORS = {
    EMPTY: 'Card number is require',
    DEFAULT: 'Card number is invalid'
};
export default class CardNumber extends BaseComponent {
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
    showValidation() {
        this.setState({
            showValidation: true
        });
    }
    componentDidMount() {
        this._mount = true;
        this._input.addEventListener('blur', this.handleBlur);
        HdStore.on('validated', this.showValidation);
    }
    componentWillUnmount() {
        this._mount = false;
        this._input.removeEventListener('blur', this.handleBlur);
    }
    handleChange(e) {
        let { value, valid, error } = e;
        let errorMessage = '';

        if (value === '') {
            errorMessage = ERRORS.EMPTY;
        } else if (valid === false) {
            errorMessage = ERRORS.DEFAULT;
        }

        this.setStateSafe({
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
        let showValidation = this.state.showValidation && !this.state.isValid;
        // let showValidation = this.props.showValidation && !this.state.isValid;
        const className = 'hdCreditCardNumber hdCreditCard__input';

        return (
            <div>
            <Number
                onChange={this.handleChange}
                render={({
                    getInputProps, value, valid, error, type
                         }) => (
                         <div>
                            <input
                                ref={(element) => this._input = element }
                                {...getInputProps()}
                                className={valid ? className + '' : className + ' error'} />
                        </div>
                        )} />

                {showValidation && <Validation
                    text={this.state.errorMessage}
                    wrapperClassName="hdValidation__wrapper_creditCard"
                    className="hdValidation hdValidation--card" />}
            </div>
        );
    }
}