/**
 * @file Datepicker component
 * @author NHR
 */
import React, { Component } from "react";
import { DatePicker } from "antd";
import "antd/lib/date-picker/style/index.css";
import moment from "moment";
import _ from 'underscore';

export default class Datepicker extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      mode: "year",
      value: _.isNull(this.props.value) ? null : moment(this.props.value || moment())
    };

  }

  onPanelChange(value, mode) {
    let newMode = mode || "month";
    this.setState({ mode: newMode, value:value });
  }

  onOpenChange(status) {
    this.setState({ mode: "year" });
  }

  onChange(date, dateString) {
    this.setState({ value:date });
    this.props.onChangeDate(date, dateString);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isNull(nextProps.value)) {
      this.setState({
        value: moment(nextProps.value || moment()) || moment()
      });
    }
  }

  render() {
    let pickerClassName = this.props.pickerClassName || "";
    let disabled = this.props.disabled || false;
    let inputStyle = this.props.inputStyle || {};
    let popupStyle = this.props.popupStyle || {};
    let format = this.props.format || "YYYY-MM-DD";

    return (
      <div className="different-datepicker">
        <div className="col-xs-12">
          <DatePicker
            onPanelChange={this.onPanelChange.bind(this)}
            onOpenChange={this.onOpenChange.bind(this)}
            onChange={this.onChange.bind(this)}
            mode={this.state.mode}
            className={pickerClassName}
            disabled={disabled}
            style={inputStyle}
            popupStyle={popupStyle}
            value={this.state.value}
            format={format}
          />
        </div>
      </div>
    );
  }
}