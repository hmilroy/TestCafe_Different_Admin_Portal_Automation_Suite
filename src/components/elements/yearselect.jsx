import React from 'react';

let yearRows = [];
for (let year = 1990; year < 2045; year++) {
    yearRows.push(<option key={year} value={year}>{year}</option>);
}

const YearSelect = (props) => (
    <div className="form-group row element main-selection">
        <label className="form-label col-xs-4">{props.title}</label>
        <select
            name={props.name}
            value={props.selectedOption}
            onChange={props.controlFunc}
            className="form-select col-xs-4"
            disabled={props.disabled ? props.disabled : false}>
            {yearRows}
        </select>
    </div>
);

YearSelect.propTypes = {
    name: React.PropTypes.string.isRequired,
    selectedOption: React.PropTypes.number,
    controlFunc: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    title: React.PropTypes.string,
    disabled: React.PropTypes.bool
};

export default YearSelect;