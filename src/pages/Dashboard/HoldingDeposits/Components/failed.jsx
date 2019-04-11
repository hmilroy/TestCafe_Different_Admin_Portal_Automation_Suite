import React from 'react';
import BaseComponent from '../../../../components/BaseComponent.jsx';
import HdService from '../../../../services/HoldingDepositService';
import HdStore from '../../../../stores/HoldingDepositStore';
import './../holdingDeposits.scss';
import angry from '../../../../assets/images/angry.svg';
import {handleError, handleSuccess} from '../../../../utility/helpers';
import _ from 'underscore';
import dig from 'object-dig';

export default class HoldingDepositFailed extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: 'test'
        };
        this.bindMethods([
            'handleClick',
            'getResponse'
        ]);
        this._mount = false;
    }

    handleClick() {
        HdService.submitPayment()
            .then((res) => {
                handleSuccess(res);
            })
            .catch((err) => {
                handleError(err);
            })
    }
    componentWillUnmount() {
        this._mount = false;
        HdStore.removeListener('change', this.getResponse);
    }
    componentDidMount() {
        this._mount = true;
        HdStore.emit('change');
        HdStore.on('change', this.getResponse);
    }

    getResponse() {
        let message = 'no message';
        if (!_.isUndefined(dig(HdStore.response, 'message'))) {
            message = HdStore.response.message;
        }
        let that = this;
        setTimeout(() => {
            this.setStateSafe({
                message: message
            });
        }, 0);

    }

    render() {
        let message = 'no message';
        if (!_.isUndefined(dig(this.props, 'error', 'message'))) {
            message = this.props.error.message;
        }

        return (
            <div>
                <div className="row">
                    <h1 className="hdTitle hdTitle--success col-sm-12">This credit card payment <em>FAILED!</em></h1>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <img className="hdSuccessImage" src={angry} alt=""/>
                    </div>
                </div>
                <div className="row">
                    <div className="hdForm col-xs-12">
                        <div className="hdFormGroup row">
                            <label className="hdLabel " htmlFor="type">Details</label>
                            <div className="col-sm-10">
                                <textarea className="hdTextArea" name="hdErrorText" id="" rows="10" value={message}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}