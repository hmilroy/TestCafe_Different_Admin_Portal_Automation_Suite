import React from 'react';
import typecast from 'typecast';
import './style.scss';

const getClass = (value)=> {
    let className = "Takeover_Percentage";
    if (typecast(value, 'number') === 0) {
        className += ` ${className}--red`
    } else if(typecast(value, 'number') === 100) {
        className += ` ${className}--green`
    }

    return className;
    // return "Takeover_Percentage";
};
const Percentage = (props) => {
    return (
        <span className={getClass(props.amount)}>{props.amount}%</span>
    )
};

export default Percentage;