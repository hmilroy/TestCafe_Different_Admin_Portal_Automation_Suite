import React from 'react';
import BaseComponent from '../../../../components/BaseComponent.jsx';
import {InputComponent} from './common';
import { isEmail, isCurrency, isNumeric } from 'validator';

export default class AmountInput extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.bindMethods(['handleChange']);
        this._mount = false;
    }
    componentWillUnmount() {
        this._mount = false;
    }
    componentDidMount() {
        this._mount = true;
    }
    handleChange(e) {
        let that = this;
        let value = e.target.value;
        let isAllowed = false;
        if (isNumeric(value)) {
            if (parseInt(value) > 99999) {
                return;
            }
            isAllowed = true;
        }
        if (value === '') {
            isAllowed = true;
        }
        if (isAllowed) {
            this.props.resetValidation('amount');
            this.setStateSafe({
                type: 'amount',
                value: value
            }, () => {
                that.props.onChange(that.state);
            });
        }
    }
    render() {
        return (
            <InputComponent
                className="hdInput--amount"
                isValid={this.props.isValid}
                errorText="Amount is required"
                type="Amount"
                holder="000"
                edit={this.props.edit}
                value={this.state.value}
                onChange={this.handleChange} />
        );
    }
}
