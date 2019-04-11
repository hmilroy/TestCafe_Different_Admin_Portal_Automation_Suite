import React from 'react';

const EmailInput = (props) => (
    <div className="form-group row element email-input">
        <label className="form-label col-xs-4">{props.title}</label>
        <input
            className="form-input col-xs-8"
            name={props.name}
            type="email"
            value={props.content}
            onChange={props.controlFunc}
            placeholder={props.placeholder} required/>
    </div>
);

EmailInput.propTypes = {
    inputType: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    controlFunc: React.PropTypes.func.isRequired,
    content: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    placeholder: React.PropTypes.string,
};

export default EmailInput;