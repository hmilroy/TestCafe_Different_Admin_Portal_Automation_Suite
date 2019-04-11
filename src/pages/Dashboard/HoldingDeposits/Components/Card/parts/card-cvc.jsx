import React from 'react';
import BaseComponent from '../../../../../../components/BaseComponent.jsx';
import {Cvc} from 'react-credit-card-primitives';
import {RenderProps, Validation} from '../../common';
import HdStore from '../../../../../../stores/HoldingDepositStore';
export default class CardCvc extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            value: '',
            showValidation: false,
            errorMessage: 'CVC number is required'
        };
        this._input = null;
        this.bindMethods([
            'handleChange',
            'handleBlur',
            'showValidation'
        ]);
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
    handleChange(e) {
        let {value, valid} = e;
        let errorMessage = ''
        if (value === '') {
            errorMessage = 'CVC number is required';
        } else {
            errorMessage = 'CVC number is invalid';
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
        let showValidation = this.state.showValidation && !this.state.isValid;
        // let showValidation = this.props.showValidation && !this.state.isValid;

        return (
            <div className={this.props.className}>
                <Cvc
                    onChange={this.handleChange}
                    render={({ getInputProps, value, valid, error, month, year }) => (
                        <div>
                            <input
                                ref={(element) => this._input = element}
                                className="hdCreditCardExpiry hdCreditCard__input"
                                {...getInputProps()} />
                            {showValidation && <Validation text={this.state.errorMessage}
                            className="hdValidation" /> }
                        </div>
                    )} />
            </div>
        );
    }
}