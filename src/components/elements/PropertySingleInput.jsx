import React from 'react';
import _ from 'underscore';

const PropertySingleInput = (props) => {

    let labelClass = 'form-label col-xs-3';
    if (!_.isUndefined(props.labelWrapClass) && !_.isEmpty(props.labelWrapClass)) {
        labelClass = props.labelWrapClass;
    }

    let inputClass = 'form-input col-xs-9';
    if (!_.isUndefined(props.inputWrapClass) && !_.isEmpty(props.inputWrapClass)) {
        inputClass = props.inputWrapClass;
    }

  return (
      <div className="form-group row element single-input">
          <label className={labelClass}>{props.title}</label>
          <input
              className={inputClass}
              name={props.name}
              type={props.inputType}
              value={props.content}
              onChange={props.controlFunc}
              disabled={props.disabled}
              placeholder={props.placeholder} required/>
      </div>
  );
}

PropertySingleInput.propTypes = {
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

export default PropertySingleInput;