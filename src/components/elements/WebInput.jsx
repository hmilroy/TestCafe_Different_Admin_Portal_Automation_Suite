import React from 'react';

import './styles/styles.scss';

const Web = (props) => (
    <div className="form-group row element web-input">
        <label className="form-label col-xs-4">{props.title}</label>
        <div>
        <input
            className="form-input col-xs-8 input-width web-input-text"
            name={props.name}
            type="text"
            value={props.content}
            onChange={props.controlFunc}
            placeholder={props.placeholder}/>
        <span className="web-prefix">http:</span>
        </div>
    </div>
);

Web.propTypes = {
    inputType: React.PropTypes.oneOf(['text', 'number']).isRequired,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    controlFunc: React.PropTypes.func.isRequired,
    content: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired
};

export default Web;
