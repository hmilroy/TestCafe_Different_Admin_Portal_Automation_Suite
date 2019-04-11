import React from 'react';

const SingleInput = (props) => (
    <div className="form-group row element single-input">
        <label className="form-label col-xs-4">{props.title}</label>
        <input
            className="form-input col-xs-8 input-width" 
            name={props.name}
            type={props.inputType}
            value={props.content}
            onChange={props.controlFunc}
            disabled={props.disabled}
            placeholder={props.placeholder} required/>
    </div>
);

SingleInput.propTypes = {
    inputType: React.PropTypes.oneOf(['text', 'number']).isRequired,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    controlFunc: React.PropTypes.func.isRequired,
    content: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    placeholder: React.PropTypes.string,
};

export default SingleInput;
