import React from 'react';
import BaseComponent from '../../../../../../components/BaseComponent.jsx';
import { RenderProps, Validation } from '../../common';
import HdStore from '../../../../../../stores/HoldingDepositStore';
const ERRORS = {
    EMPTY: 'Card Holder name is required',
    PAST: 'Expiry date can not be a past date',
    DEFAULT: 'Expiry date is invalid'
};
export default class CardHolderName extends BaseComponent {
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
            'showValidation'
        ]);
        this._input = null;
        this._mount = false;
    }
    componentDidMount() {
        this._mount = true;
        HdStore.on('validated', this.showValidation);
    }
    componentWillUnmount() {
        this._mount = false;
    }
    showValidation() {
        this.setStateSafe({
            showValidation: true
        });
    }
    handleChange(e) {
        let value = e.target.value;
        let isValid = true;
        if (value.length <= 1) {
            isValid = false;
        }
        this.setState({
            value: value,
            showValidation: false,
            isValid: isValid
        });
        let data = {
            value: value,
            type: this.props.type,
            valid: isValid,
            isValid: isValid
        };
        this.props.onChange(data);
    }
    render() {
        let showValidation = this.state.showValidation && !this.state.isValid;
        // let showValidation = this.props.showValidation && !this.state.isValid;

        return(
            <div>
                <input
                onChange={this.handleChange}
                className="hdCreditCardName hdCreditCard__input" type="text" placeholder="Name on card"/>
                {showValidation && <Validation
                    text={this.state.errorMessage}
                    className="hdValidation hdValidation--card" />}
            </div>
        );
    }
}