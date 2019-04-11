import React from 'react';
import BaseComponent from '../../../../components/BaseComponent.jsx';
import '../holdingDeposits.scss';
import smile from '../../../../assets/images/smile.svg';

export default class HoldingDepositSuccess extends BaseComponent {

    render() {
        return(
            <div>
                <div className="row">
                    <h1 className="hdTitle hdTitle--success col-sm-12">The credit card payment has been successful!</h1>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <img className="hdSuccessImage" src={smile} alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}