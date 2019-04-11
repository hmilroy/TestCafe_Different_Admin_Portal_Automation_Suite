import React from 'react';
import Moment from 'moment';

export default class BillItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bill: props.bill,
            checked: props.checked
        };
        this.handleOnTick = this.handleOnTick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isUndefined(nextProps.bill.active) && !_.isUndefined(this.props.bill.active)) {
            if (nextProps.bill.active !== this.props.bill.active) {
                this.setState({
                    bill: nextProps.bill
                });
            }
        } else if (!_.isUndefined(nextProps.bill.active) ) {
            this.setState({
                bill: nextProps.bill
            });
        }
        if (!_.isUndefined(nextProps.bill) && _.isNull(this.props.bill)) {
            thise.setState({
                bill: nextProps.bill
            });
        }

        if(!_.isUndefined(nextProps.bill.validation) && !_.isUndefined(this.props.bill.validation)) {
            this.setState({
                bill: nextProps.bill
            });
        }
    }

    handleOnTick(e) {
        let bill = _.clone(this.state.bill);
        let checked = e.target.checked;
        bill.active = checked;
        this.setState({
            bill: bill
        });
        this.props.onTick(bill);
    }

    handleOnChange(e) {
        let bill = _.clone(this.state.bill);
        let value = e.target.value;
        bill.email = value;
        this.setState({
            bill: bill
        });
        this.props.onChange(bill);
    }

    render() {
        let email = '';
        if (!_.isNull(this.state.bill.email)) {
            email = this.state.bill.email;
        }

        let date = '';
        if (!_.isUndefined(this.props.bill) && !_.isNull(this.props.bill) && !_.isUndefined(this.props.bill.updated_at) && !_.isNull(this.props.bill.updated_at)) {
            date = Moment(this.props.bill.updated_at).format('YYYY-MM-DD');
        }

        return (
            <div className="DA-CheckboxItem table-row">
                <div className="DA-CheckboxItem__checkboxWrap table-cell">
                    <label><input disabled={!this.props.isEditing}
                                  className="DA-CheckboxItem__checkbox"
                                  type="checkbox" id="1"
                                  checked={this.state.bill.active}
                                  onChange={this.handleOnTick}/>
                        <span className="DA-CheckboxItem__label">{this.state.bill.label}</span>
                    </label>
                </div>
                {this.props.bill.emailRequired &&
                <div className="table-cell">
                    {this.props.isEditing === true ?
                    <input type="text" className="DA-CheckboxItem__input" value={email} onChange={this.handleOnChange}/>
                    :
                        <span className="DA-CheckboxItem__email">{this.state.bill.email}</span>}
                    {(this.props.isEditing && this.props.bill.validation === false) && <p className="validation-error">{this.props.bill.validationError}</p>}
                </div>}
                <div className="table-cell">
                    {this.props.showDate && <span className="DA-CheckboxItem__date ">{date}</span>}
                </div>
            </div>
        )
    }
}