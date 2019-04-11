import React from 'react';

const Select = (props) => (
    <div className="form-group row element main-selection">
        <label className="form-label col-xs-4">{props.title}</label>
        <select
            name={props.name}
            value={props.selectedOption}
            onChange={props.controlFunc}
            className="form-select col-xs-8"
            disabled={props.disabled ? props.disabled : false}>
            {props.options.map(opt => {
                return (
                    <option
                        key={opt.name}
                        value={opt.name}>{opt.name}</option>
                );
            })}
        </select>
    </div>
);

Select.propTypes = {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectedOption: React.PropTypes.string,
    controlFunc: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    title: React.PropTypes.string,
    disabled: React.PropTypes.bool
};

export default Select;
