import React from 'react';
import Draggable from 'react-draggable';
import {card} from 'creditcards';
export const Validation = (props) => <div className={props.wrapperClassName}>
    <div className={props.className}>{props.text}</div>
</div>;

export const InputComponent = (props) => {
    let validation = null;
    if (props.isValid === false) {
        validation = <Validation text={props.errorText}
            wrapperClassName="hdValidation__wrapper hdValidation__wrapper--normal"
        className="hdValidation hdValidation--card_holder"/>
    }
    return (
        <div className="hdFormGroup row">
            <label className="hdLabel " htmlFor="email">{props.type}</label>
            {props.edit ? <input
                onChange={props.onChange}
                value={props.value}
                placeholder={props.holder}
                className={'hdInput ' + props.className}
                type="text" /> : <label className="hdValueLabel">{props.value}</label>}
            {validation}
        </div>
    );
};

export const CreditCardPreview = ({className, cardInfo}) => {
    let {card_holder, card_cvv, card_expiry, card_number} = cardInfo;
    card_number = card.format(card_number, ' ');
    if (card_expiry.length === 4) {
        card_expiry = card_expiry.substr(0,2) + ' / ' + card_expiry.substr(2,4);
    }
    const style = {
        color: '#dcdfe5'
    };
    return(
        <div className={className}>
            <label className="hdLabel " htmlFor="amount">Card Details</label>
            <div className="col-xs">
                <div>
                    <div className="row start-xs"><label className="hdValueLabel">{card_number}</label></div>
                    <div className="row start-xs">
                        <label className="hdValueLabel">
                            <span className="hdCcParts">{card_holder}</span>
                            <span style={style} className="hdCcParts">|</span>
                            <span className="hdCcParts">{card_expiry}</span>
                            <span className="hdCcParts">{card_cvv}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const RenderProps = (props) => {
    let styles = {};
    if (props.hidden) {
        styles = {
            display: 'none'
        };
    }
    return (
        <Draggable>
            <div className="dev_display" style={styles}>
                <h1>rendering props</h1>
                {JSON.stringify(props)}
            </div>
        </Draggable>
    );
};
