import React from 'react';
import ReactPhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';

require('./styles/styles.scss');

const EditablePhoneInput = (props) => (
    <div className="form-group row element phone-number-section">
        <label className="form-label col-xs-4">Mobile Phone</label>
        <div className="col-xs-8">
            <div className="row ">
                <div className="phone-flag-div">

                    {!props.edit ?

                        <ReactPhoneInput
                          country={props.country}
                          disabled={true}
                          onChange={()=>{}}/>
                        :

                            <ReactPhoneInput
                              country={props.country}
                              onChange={()=>{}}
                              onCountryChange={ (country) => props.onCountryCodeChange(country) }/>
                    }
                </div>
                {props.edit ?
                    <div className="col-xs-10">
                        <ul className="diff-phone-input">
                            <li>
                                <span className="">
                                    {props.countryCode}</span>
                            </li>
                            <li>
                                <input
                                    className="form-input"
                                    name={"Mobile Number"}
                                    type={"text"}
                                    value={props.number}
                                    onChange={props.onPhoneChange}
                                    disabled={false} />
                            </li>
                        </ul>
                    </div>
                    :
                    <div>
                        <ul className="diff-phone-input diff-phone-input--edit">
                            <li>
                                <span className="">{props.countryCode || '+61'}</span>
                            </li>
                            <li>
                                <input
                                    className="form-input"
                                    name={"Mobile Number"}
                                    type={"text"}
                                    value={props.number}
                                    onChange={props.onPhoneChange}
                                    disabled={true} />
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    </div>
);

export default EditablePhoneInput;
