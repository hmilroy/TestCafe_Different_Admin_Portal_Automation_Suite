import React from 'react';
import {Router} from 'react-router';
import {handleSuccess, isCurrencyInput} from '../../../utility/helpers';
import BaseComponent from '../../../components/BaseComponent';
import './holdingDeposits.scss';
import './amount.scss';
import dig from 'object-dig';
import _ from 'underscore';
import HoldingDepositStore from '../../../stores/HoldingDepositStore';
import HoldingDepositService from '../../../services/HoldingDepositService';
import AuthService from '../../../services/AuthService';
import LoginStore from '../../../stores/LoginStore';
import HdAction from '../../../actions/HoldingDepositActions';
import BlockingActions from '../../../actions/BlockingActions';
import API from '../../../constants/apiConstants';
import Failed from './Components/failed';
import Success from './Components/success';
import CreditCard from './Components/Card/index';
import PropertyInput from './Components/PropertyInput/index';
import {isEmail, isCurrency, isNumeric} from 'validator';
import Toastr from 'toastr';
import Draggable from 'react-draggable';
import AmountInput from './Components/amount-input';
import EmailInput from './Components/email-input';
import { InputComponent, RenderProps} from './Components/common'


const Validation = (props) => <div className="hdValidation__wrapper hdValidation__wrapper--normal">
                                <div className="hdValidation">{props.text}</div>
                            </div>;

export default class HoldingDeposits extends BaseComponent {
    constructor(props) {
        super(props);
        this._mount = false;
        this.state = {
            edit: true,
            creditCard: {
                card_holder: '',
                valid: false
            },
            email: '',
            property_id: '',
            amount: '',
            status: HoldingDepositStore.status,
            error: {},
            isFormValid: true,
            showCreditCardValidation: false,
            isValid: {
                email: true,
                amount: true,
                property: true,
                card_holder: true
            },
            cardError: ''
        };
        this.bindMethods([
            'handleCreditCardChange',
            'handleChange',
            'handleSubmitForm',
            'handleEditForm',
            'submitForm',
            'handleNext',
            'getFormData',
            'updateStatus',
            'refreshStore',
            'validateForm',
            'renderForm',
            'resetState',
            'resetValidation',
            'validateCreditCard'
        ]);
    }

    resetValidation(type) {
        let validation = this.state.isValid;
        validation[type] = true;
        this.setStateSafe({
            isValid: validation
        });
    }

    resetState() {
        this.setStateSafe({
            creditCard: {},
            email: '',
            property_id: '',
            amount: '',
            isValid: {
                email: true,
                amount: true,
                property: true,
                card_holder: true
            },
            cardError: ''
        });
    }

    componentWillUnmount() {
        this._mount = false;
    }
    componentDidMount() {
        this._mount = true;
        HoldingDepositStore.on('statusChanged', this.updateStatus);
    }
    validateCreditCard() {
        HdAction.updateValidation({
            'credit_card': false
        });
    }
    validateForm() {
        let validation = this.state.isValid;
        let isValid = true;
        let cardError = '';
        this.validateCreditCard();
        if (isEmail(this.state.email) !== true) {
            isValid = false;
            validation.email = false;
        }

        if (isNumeric(this.state.amount) !== true) {
            isValid = false;
            validation.amount = false;
        }

        if (!this.state.property_id)  {
            isValid = false;
            validation.property = false;
        }

        // if (!this.state.creditCard.card_holder) {
        //     isValid = false;
        //     validation.card_holder = false;
        //     cardError = 'Please fill all Credit Card related details';
        // }
        // let cardInfo = this.state.creditCard;
        // if(!(cardInfo.card_number && cardInfo.card_expiry && cardInfo.card_cvv)) {
        //     isValid = false;
        //     validation.card_holder = false
        //     cardError = 'Please fill all Credit Card related details'
        // }

        if (!_.isUndefined(dig(this.state, 'creditCard', 'valid')) && this.state.creditCard.valid === false) {
            isValid = false;
            this.setState({
                showCreditCardValidation: true
            });
        }

        this.setStateSafe({
            isValid: validation,
            cardError: cardError
        });
        HdAction.formValidated();
        return isValid;
    }

    handleNext() {
        let isValid = this.validateForm();
        if (isValid) {
            this.setStateSafe({
                edit: false
            });
        }
    }

    refreshStore() {
        HdAction.updateStatus({
            status: API.HOLDING_DEPOSITS.STATUS.FRESH
        });
        this.handleEditForm();
        this.resetState();
    }

    updateStatus() {
        this.setStateSafe({
            status: HoldingDepositStore.status
        });
    }

    handleEditForm() {
        this.setStateSafe({
            edit: true
        });
    }

    handleSubmitForm() {
        this.submitForm();
    }

    getFormData() {
        let obj = {
            payment_type: '10',
            property_id : this.state.property_id,
            card_expiry:this.state.creditCard.card_expiry,
            card_number: this.state.creditCard.card_number,
            card_holder: this.state.creditCard.card_holder,
            card_cvv: this.state.creditCard.card_cvv,
            email: this.state.email,
            amount: this.state.amount
        };
        return obj;
    }

    submitForm() {
        setTimeout(BlockingActions.block);
        HoldingDepositService.submitPayment()
            .then((data) => {
                let code = '';
                if (!_.isUndefined(dig(data, 'status', 'code'))) {
                    code = data.status.code;
                }
                if (code === 200) {
                    HdAction.updateStatus({
                        status: API.HOLDING_DEPOSITS.STATUS.SUCCESS
                    });
                } else {
                    HdAction.updateStatus({
                        status: API.HOLDING_DEPOSITS.STATUS.FAILED
                    });
                }
                handleSuccess(data);
                BlockingActions.unblock();
            })
            .catch((error) => {
                BlockingActions.unblock();
                this.setStateSafe({
                    error: error
                });
                HdAction.updateStatus({
                    status: API.HOLDING_DEPOSITS.STATUS.FAILED
                });
                Toastr.error('Payment failed !!');
            });
    }

    handleCreditCardChange(e) {
        this.setStateSafe({
            creditCard: e
        }, () => {
            HoldingDepositService.changeInfo(this.getFormData());
        });

    }

    renderForm() {
        const commonProps = {
            resetValidation: this.resetValidation
        };

        return(
            <div className="row center-sm">
                <div className="hdContainer">
                    <div>
                        <div className="row">
                            <h1 className="hdTitle col-sm-12">Request a credit card payment</h1>
                        </div>
                        <div className="hdForm">
                            <div className="hdFormGroup row">
                                <label className="hdLabel " htmlFor="type">Type</label>
                                <label className="hdValueLabel">Holding Deposit</label>
                            </div>
                            <PropertyInput
                                {...commonProps}
                                isValid={this.state.isValid.property}
                                onChange={this.handleChange}
                                edit={this.state.edit}/>
                            <AmountInput
                                {...commonProps}
                                isValid={this.state.isValid.amount}
                                onChange={this.handleChange}
                                edit={this.state.edit} />
                            <CreditCard
                                {...commonProps}
                                showValidation={this.state.showCreditCardValidation}
                                errorText={this.state.cardError}
                                isValid={this.state.isValid.card_holder}
                                onChange={this.handleCreditCardChange}
                                edit={this.state.edit}/>
                            <EmailInput
                                {...commonProps}
                                isValid={this.state.isValid.email}
                                onChange={this.handleChange}
                                edit={this.state.edit}/>
                        </div>
                    </div>

                    <div className="hdForm">
                        {this.state.edit ? <div className="hdFormGroup row end-sm">
                            <div className="button button_main hdButton" onClick={this.handleNext}>Next</div>
                        </div> : <div className="hdFormGroup row end-sm">
                            <div className="button hdButton" onClick={this.handleEditForm}>Back</div>
                            <div className="button button_main hdButton" onClick={this.handleSubmitForm}>Confirm</div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

    handleChange(e) {
        let obj = {};
        obj[e.type] = e.value;
        this.setStateSafe(obj, () => {
            HoldingDepositService.changeInfo(this.getFormData());
        });
    }

    render() {
        let view = <div>null</div>;
        const FailedControlls = () => <div className="hdForm">
            <div className="hdFormGroup row end-sm">
                <div className="button button_main hdButton hdButton--newPayment" onClick={this.refreshStore}>Make another payment</div>
                <div className="button button_secondary hdButton" onClick={this.handleSubmitForm}>Try Again</div>
            </div>
        </div>;
        const SuccessControlls = () => <div className="row hdSuccessControlls">
            <div className="col-xs-12">
                <div className="button button_main hdButton hdButton--newPayment hdButton--center" onClick={this.refreshStore}>Make another payment</div>
            </div>
        </div>;
        switch (this.state.status) {
            case API.HOLDING_DEPOSITS.STATUS.FRESH:
                view = this.renderForm();
                break;
            case API.HOLDING_DEPOSITS.STATUS.FAILED:
                view = <div className="row center-sm">
                            <div className="hdContainer">
                                <Failed error={this.state.error}/>;
                                <FailedControlls/>
                            </div>
                        </div>;
                break;
            case API.HOLDING_DEPOSITS.STATUS.SUCCESS:
                view = <div className="row center-sm">
                            <div className="hdContainer">
                                <Success/>
                                <SuccessControlls/>
                            </div>
                        </div>;
                break;
            default:
                view = this.renderForm();
                break;
        }

        return(<div> <RenderProps hidden={true} arr={this.state}/>{view}</div>);
        // return(<div>{view}</div>);
    }
}