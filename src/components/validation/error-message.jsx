/**
 * @file MAA Validation Component.
 * @author Bhanuka Mallawaarachchi
 */
import React, {Component} from 'react';
import './style.scss';

export default class ErrorMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="validation-row">
                {this.props.error ? <div className="validate-error">
                    <div className="validate-error__icon"></div>
                    <p className="validate-error__text">{this.props.message}</p>
                </div>
                    : <div className="validate-error">
                        <div className="validate-error__icon validate-error__icon--hidden"></div>
                        <p className="validate-error__text"></p>
                    </div>}
            </div>
        );
    }
}