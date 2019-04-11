import React from 'react';
import ReactPhoneInput from 'react-phone-input';

require('./styles/styles.scss');

const Phone = (props) => (
    <div className="form-group row element phone-number-section">
        <label className="form-label col-xs-4">{props.title}</label>
        <div className="col-xs-8">
            <div className="row">
            <div className="col-xs-1">
                <ReactPhoneInput
                    className="form-input col-xs-1"
                    defaultCountry={"au"}
                    value={props.countryCode}
                    onChange={props.getCountryCode}/>
            </div>
            <div className="col-xs-11">
            {props.code ? props.code : ''}
                <span className="country-code">{props.countryCode}</span>
                <input
                    className="form-input col-xs-10 phone-number"
                    name={props.name}
                    type={props.inputType}
                    value={props.content}
                    onChange={props.getLocal}
                    placeholder={props.placeholder} required/>

            </div>
            </div>
        </div>
    </div>
);

Phone.propTypes = {
    inputType: React.PropTypes.oneOf(['text', 'number']).isRequired,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    countryCode: React.PropTypes.string.isRequired,
    getCountryCode: React.PropTypes.func.isRequired,
    getLocal: React.PropTypes.func.isRequired,
    content: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    placeholder: React.PropTypes.string
};

export default Phone;