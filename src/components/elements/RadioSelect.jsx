import React from 'react';

const RadioSelect = (props) => (
    <div className="form-group row element radio-select-section">
        <label className="form-label col-xs-4">{props.title}</label>
        {props.ownerStates.map( state => {
            return (
                <div className="col-xs-4 radio-select row" key={state.id}>
                    <input type="radio"
                           className="radio-button-box"
                           name={props.name}
                           value={state.name}
                           onChange={props.controlFunc}
                           checked={state.name === props.selectedOwnerState} />
                    <div className="state-name">{state.name}</div>
                </div>
            );
        })}
    </div>
);

RadioSelect.propTypes = {
    name: React.PropTypes.string.isRequired,
    ownerStates: React.PropTypes.array.isRequired,
    selectedOwnerState: React.PropTypes.string.isRequired,
    controlFunc: React.PropTypes.func.isRequired,
    title: React.PropTypes.string
};

export default RadioSelect;