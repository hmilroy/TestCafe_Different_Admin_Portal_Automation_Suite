import React from 'react';
import BaseComponent from '../../../components/BaseComponent';
import PDService from '../../../services/PaymentDashboardService';
import PDStore from '../../../stores/PaymentDashboardStore';
import moment from 'moment';
import DatePicker from '../../../components/elements/DatePicker';

import './transactions.scss';

const formatDate = (dateObject) => {
    return moment(dateObject).format('YYYY-MM-DD');
}
const getDateFromStore = () => {
    return moment(PDStore.date).format('YYYY-MM-DD');
}
const updateFromStore = () => {
    date = getDateFromStore();
    calander_date = getDateForCalander();
}
const getDateForCalander = () => {
    return moment(PDStore.date).toDate();
}
let date = updateFromStore();
let calander_date = getDateForCalander();

const fetchPayments = () => {
    let options = {
        start_date: getDateFromStore()
    };
    PDService.fetchAllPayments(options);
};

export class DateInput extends BaseComponent {
    constructor(props) {
        super(props);
        this.bindMethods(
            [
                'handleDateChange'
            ]
        )
    }
    componentDidMount() {
        PDStore.on('change', updateFromStore);
        fetchPayments();
    }
    handleDateChange(e, newDate) {
        let options = {
            start_date: formatDate(newDate)
        };
        PDService.updateOptions(options);
    }
    componentWillUnmount() {
        PDStore.removeListener('change', updateFromStore);
    }
    render() {
        return(
            <div className={this.props.className}>
                <DatePicker
                    onChangeDate={this.handleDateChange}
                    format={"MMM DD, YYYY"}
                    value={calander_date}/>
            </div>
        );
    }
}

const linkButtonStyles = {
    'color': '#45c7f5',
    'fontWeight': '700',
    'textTransform': 'uppercase',
    'borderBottom': '2px solid',
    'display': 'inline-block'
}

const buttonProps = {
    style: linkButtonStyles
}

const addDay = () => {
    let options = {
        start_date: moment(getDateFromStore()).add(1, 'day')
    }
    PDService.updateOptions(options);
}


const subtractDay = () => {
    let options = {
        start_date: moment(getDateFromStore()).subtract(1, 'day')
    }
    PDService.updateOptions(options);
}

export const PrevButton = (props) => {
    return (
        <div onClick={subtractDay}  className={props.className + ' link-button'}>
            <div className="link-button__icon link-button__icon--prev"></div>
            <div className="link-button__label  link-button__label--prev" {...buttonProps}>
                Previous day
            </div>
        </div>
    );
}
export const NextButton = (props) => {
    return (
        <div onClick={addDay} className={props.className + ' link-button'}>
            <div className="link-button__label  link-button__label--next" {...buttonProps}>
                Next day
            </div>
            <div className="link-button__icon"></div>
        </div>
    );
}
