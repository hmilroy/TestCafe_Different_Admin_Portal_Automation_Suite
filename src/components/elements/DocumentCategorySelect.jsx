import React from 'react';

const SelectCategory = (props) => (
    <div className="form-group row element main-selection">
        <label className="form-label col-xs-4 pop-up-label">{props.title}</label>
        <select
            name={props.name}
            value={props.selectedOption}
            onChange={props.controlFunc}
            className="form-select col-xs-8 pop-up-select" disabled={props.disable}>
            {props.options.map(opt => {
                return (
                    <option
                        key={opt.id}
                        value={opt.id}>{opt.name}</option>
                );
            })}
        </select>
    </div>
);

SelectCategory.propTypes = {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectedOption: React.PropTypes.number,
    controlFunc: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    title: React.PropTypes.string,
    disable: React.PropTypes.bool
};

export default SelectCategory;
