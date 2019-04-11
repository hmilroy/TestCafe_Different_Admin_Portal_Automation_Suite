import React from 'react';
import BaseComponent from '../../../../../components/BaseComponent.jsx';
import CardHolderName from './parts/holder-name.jsx';
import CardNumber from './parts/card-number.jsx';
import CardExpiry from './parts/card-expiry.jsx';
import CardCvc from './parts/card-cvc.jsx';
import {CreditCardPreview} from '../common';

export default class CreditCard extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            card_expiry: '',
            card_number: '',
            card_holder: '',
            card_cvv: '',
            valid: {}
        };
        this.bindMethods([
            'getCardInfo',
            'handleChange'
        ]);
    }

    getCardInfo() {
        let valid = false;
        if (this.state.valid.card_expiry && this.state.valid.card_number && this.state.valid.card_cvv && this.state.valid.card_holder) {
            valid = true;
        }
        return {
            card_expiry: this.state.card_expiry,
            card_number: this.state.card_number,
            card_holder: this.state.card_holder,
            card_cvv: this.state.card_cvv,
            valid: valid
        };
    }

    handleChange({value, type, valid}) {
        let obj = {};
        obj[type] = value;
        let validation = _.clone(this.state.valid);
        validation[type] = valid;
        obj.valid = validation;
        this.setState(obj, () => {
            this.props.onChange(this.getCardInfo())
        });
    }

    render() {
        const props = {
            showValidation: this.props.showValidation,
            onChange: this.handleChange
        };

        let editViewPort = <CreditCardPreview className="hdFormGroup row" cardInfo={this.state}/>;
        let viewPort = <div>
            <div className="hdFormGroup hdFormGroup--creditCard hdCreditCard hdFormGroup--relative row">
                <label className="hdLabel " htmlFor="property">Card Details</label>
                <div className="hdCreditCard__wrapper">
                    <CardNumber {...props} type="card_number"/>
                    <CardHolderName {...props} type="card_holder"/>
                    <div className="row">
                        <div className="col-sm-12">
                            <CardExpiry
                                className="HdCCParts HdCCParts--expiry"
                                {...props}
                                type="card_expiry" />
                            <CardCvc
                                className="HdCCParts HdCCParts--cvc"
                                {...props}
                                type="card_cvv" />
                        </div>
                    </div>
                </div>
            </div>
        </div>;
        if (this.props.edit === false) {
            viewPort = editViewPort;
        }
        return viewPort;
    }
}