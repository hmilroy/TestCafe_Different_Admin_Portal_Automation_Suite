import React from 'react';
require ('./styles/styles.scss');

const CategorySelect = (props) => (
    <div className="form-group row element main-selection category">
        <label className="form-label col-xs-4">{props.title}</label>
        <div className="col-xs-8 input-width">
            <div className="row">
                <select
                    name={props.name}
                    value={props.selectedOption}
                    onChange={props.controlFunc}
                    className="form-select col-xs-5">
                    <option value="">{props.placeholder}</option>
                    {props.options.map(opt => {
                        return (
                            <option
                                key={opt.name}
                                value={opt.name}>{opt.name}</option>
                        );
                    })}
                </select>

                {props.selectedOption == '' && (
                    <input
                        className="form-input col-xs-6 left-margin-add"
                        type={'text'}
                        name={'company'}
                        onChange={props.otherControlFunc}
                        value={props.otherValue} required/>
                )}
            </div>
        </div>
    </div>
);

CategorySelect.propTypes = {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectedOption: React.PropTypes.string,
    controlFunc: React.PropTypes.func.isRequired,
    otherControlFunc: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    otherValue: React.PropTypes.string,
    title: React.PropTypes.string
};

export default CategorySelect;
