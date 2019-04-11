import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import _ from 'underscore';
import dig from 'object-dig';
import CircularProgress from 'material-ui/CircularProgress';

import PropertyService from '../../../../services/PropertiesServices.js';
import PropertyStore from '../../../../stores/PropertyStore';
import PaymentStatus from '../../../../../data/paymentstatus.json';
import HoldingDepositStatus from '../../../../../data/holdingDepositStatus.json';
import TYPES from '../../../../../data/paymentTypes.json';

import 'react-table/react-table.css';
import './schedule.scss';

const Loader = (<div className="form-group row center-xs element">
    <label className="form-label col-xs-12">
        <CircularProgress size={30} thickness={2}/>
    </label>
</div>);

const colWdith = {
    requestDate:130,
    debitDate: 130,
    amount: 90,
    status_description: 90,
    type: 130,
    detail: 220,
    payment_type: 130
}

const columns = [{
    header: () => <span>Date requested</span>,
    id: 'requestDate',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>{d.requestDate}</span>
    ),
    minWidth: colWdith.requestDate,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Date received</span>,
    id: 'debitDate',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>{d.debitDate}</span>
    ),
    minWidth: colWdith.debitDate,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Amount</span>,
    id: 'amount',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>${d.amount}</span>
    ),
    minWidth: colWdith.amount,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Status</span>,
        id: 'status_description',
    accessor: d => <div className="payment-status">
        <span
            className={d.status_description}>{d.status_description}</span>
    </div>,
    minWidth: colWdith.status_description,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Type</span>,
    id: 'type',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>{d.type}</span>
    ),
    minWidth: colWdith.type,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Details</span>,
    id: 'detail',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>{d.detail}</span>
    ),
    minWidth: colWdith.detail,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}, {
    header: () => <span>Payment type</span>,
    id: 'payment_type',
    accessor: d => (
        <span className={d.status == 5 ? 'shaded-table-field' : 'table-field'}>{d.payment_type}</span>
    ),
    minWidth: colWdith.payment_type,
    sortable: false,
    headerClassName: 'schedule-custom-header'
}];

export default class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            data: [],
            loading: true,
            latestPayment: null,
            arrearsCount: 0,
            message: null,
            titleDate: null
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let self = this;
        PropertyService.getPaymentSchedule(PropertyStore.propertyId)
            .then(function (value) {
                let data = [];
                let message = '';
                if (!_.isUndefined(dig(value, 'data', 'paymentList')) && value.data.paymentList.length > 0) {
                   data = value.data.paymentList.map((payment) => {
                        let detail = '-';
                        if (payment.period) {
                            detail = moment(payment.period.from).format('MMM DD, YYYY') + ' - ' + moment(payment.period.to).format('MMM DD, YYYY');
                        }
                        let paymentType = '';
                        let type = 'the type'
                        let status_description = '';
                        status_description = PaymentStatus[payment.status].name;
                        // Handling payment states for displaying details
                        if (!_.isUndefined(dig(payment, 'status'))) {
                            if (payment.status === 4 ) {
                                detail = '-';
                            }
                        }
                        // Setting type
                        if (!_.isUndefined(dig(payment, 'type'))) {
                            if (!_.isUndefined(dig(TYPES), payment.type)) {
                                type = TYPES[payment.type].name;
                            }
                            // Handle Holding Deposit specific information
                            if (payment.type === '10' && !_.isUndefined(dig(payment, 'detail')) && !_.isUndefined(payment, 'satus')) {
                                detail = payment.detail;
                                status_description = HoldingDepositStatus[payment.status].name;
                            }
                        }
                        // Setting payment type
                        if (!_.isUndefined(dig(payment, 'paymentType'))) {
                            switch (payment.paymentType.toUpperCase()) {
                            case 'C':
                                paymentType = 'Credit';
                                break;
                            case 'D':
                                paymentType = 'Debit';
                                break;
                            default:
                                break;
                            }
                        }

                        return ({
                            requestDate: moment(payment.requestDate).format('MMM DD, YYYY'),
                            debitDate: moment(payment.debitDate).format('MMM DD, YYYY'),
                            amount: payment.amount,
                            status: payment.status,
                            type: type,
                            detail: detail,
                            payment_type: paymentType,
                            status_description: status_description
                        });
                    });
                    self.setState({
                        loading: false,
                        data: data,
                        count: data.length,
                        latestPayment: value.data.latestPayments.lastPayment,
                        arrearsCount: value.data.arrears.count,
                        titleDate: value.data.titleDate,
                        message: message
                    })
                } else {
                    self.setState({
                        loading: false,
                        data: null,
                        message: value.status.message
                    })
                }
            })
            .catch(error => {
                if (!_.isNull(error.response) && !_.isUndefined(error.response)) {
                    self.setState({
                        loading: false,
                        data: null,
                        message: JSON.parse(error.response).status.message
                    })
                }
            })
    }

    render() {
        
        return (
            <div className="schedule-section">
                {this.state.loading && Loader}
                {!this.state.loading && (<div>
                    {this.state.data && <div>
                        <div className="head-section">
                            <div className="row">
                                {!_.isEmpty(this.state.latestPayment) &&
                                <div className="header-message">
                                    <div
                                        className={PaymentStatus[this.state.latestPayment.paymentStatus].name}>
                                        {PaymentStatus[this.state.latestPayment.paymentStatus].message}
                                        {moment(this.state.titleDate).format('MMMM DD, YYYY')}
                                        { this.state.latestPayment.paymentStatus == 0 && ' (' + moment().from(moment(this.state.latestPayment.paymentDate), true) + ') '}
                                    </div>
                                </div>}
                                <div>
                                    <div className="total-times-in-arrear">Total times in
                                        arrears: {this.state.arrearsCount}</div>
                                </div>
                            </div>
                        </div>
                        <ReactTable data={this.state.data}
                                    columns={columns}
                                    pageSize={this.state.count}
                                    showPagination={false}
                                    loading={this.state.loading}
                                    className="dashboardPropertyTable paymentSchedulesTable"/>
                    </div>}
                    {!this.state.data && <div className="head-section">
                        <div className="header-message not-found">
                            <div className="Submitted">
                                {this.state.message}
                            </div>
                        </div>
                    </div>}
                </div>)}
            </div>
        );
    }
}
