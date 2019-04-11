import React from 'react';
import BaseComponent from '../../../../components/BaseComponent.jsx';
import {InputComponent} from './common';

export default class EmailInput extends BaseComponent {
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
        this.props.resetValidation('email');
        this.setStateSafe({
            type: 'email',
            value: e.target.value
        }, () => {
            that.props.onChange(that.state);
        });
    }

    render() {
        return (
            <InputComponent
                isValid={this.props.isValid}
                type="Email"
                errorText="Email is not valid"
                holder="Email Address"
                edit={this.props.edit}
                value={this.state.value}
                onChange={this.handleChange} />
        );
    }
}