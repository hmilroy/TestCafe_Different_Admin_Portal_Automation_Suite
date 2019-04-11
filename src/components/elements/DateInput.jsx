import React from 'react';
import DatePicker from 'material-ui/DatePicker';

const DateInput = (props) => {
    let labelClass = props.labelClass ? props.labelClass : '';
    return (
        <div className="form-group row element single-input">
            <label className={'form-label col-xs-4 ' + labelClass}>Date inspected</label>
            <DatePicker
                id={props.id}
                hintText=""
                value={props.dateValue}
                onChange={props.handleChange}
                disabled={props.disabled}
                className={props.rootClassName}
            />
        </div>
    );
};

export default DateInput;