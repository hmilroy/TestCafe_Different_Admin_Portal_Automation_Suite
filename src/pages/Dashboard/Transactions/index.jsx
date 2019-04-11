import React from 'react';
import BaseComponent from '../../../components/BaseComponent';
import ReactTable from 'react-table';
import PDStore from '../../../stores/PaymentDashboardStore';
import PAYMENT_STATUS_HASH from '../../../../data/paymentstatus';
import HOLDING_DEPOSIT_STATUS_HASH from '../../../../data/holdingDepositStatus';
import { DateInput, NextButton, PrevButton } from './components';

export default class Transactions extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pages: 5,
            pageIndex: 1,
            payments: [],
            loading: true
        }
        this.bindMethods([
            'handleTableClick',
            'updateFromStore'
        ]);
    }
    componentDidMount() {
        this._mount = true;
        PDStore.on('change', this.updateFromStore);
    }
    componentWillUnmount() {
        this._mount = false;
        PDStore.removeListener('change', this.updateFromStore);
    }
    updateFromStore() {
        this.setState({
            loading: true
        });
        if (!_.isUndefined(PDStore.paymentList)) {
            this.setStateSafe({
                payments: PDStore.paymentList,
                loading: PDStore.loading
            });
        }
    }
    handleTableClick(state, rowInfo, column) {

    }
    render() {
        const colWidth = {
            address: 250,
            amount: 150,
            date: 170,
            status: 150,
            type: 170,
            details: 250,
            payType: 130
        }
        const columns = [{
            minWidth: colWidth.address,
            header: 'Property Tenant',
            id: 'address',
            accessor: 'propertyAddress'
        }, {
            minWidth: colWidth.amount,
            header: 'Amount',
            id: 'amount',
            accessor: (data) => {
                if (data.amount) {
                    return '$' + data.amount;
                } else {
                    return '';
                }
            }
        }, {
            minWidth: colWidth.date,
            header: 'Date Received',
            id: 'date_received',
            accessor: 'dateReceived'
        }, {
            minWidth: colWidth.status,
            header: 'Status',
            id: 'status',
            accessor: (data) => {
                let status = data.status;
                if (data.type === 'Holding Deposit') {
                    if (!_.isNull(HOLDING_DEPOSIT_STATUS_HASH[data.status])) {
                        status = HOLDING_DEPOSIT_STATUS_HASH[data.status].name;
                    } 
                } else {
                    if (!_.isNull(PAYMENT_STATUS_HASH[data.status])) {
                        status = PAYMENT_STATUS_HASH[data.status].name;
                    } 
                }

                return <div className={"PDStatus PDStatus--" + status}>{status}</div>;
            }
        }, {
            minWidth: colWidth.type,
            header: 'Type',
            id: 'type',
            accessor: 'type'
        }, {
            minWidth: colWidth.details,
            header: 'Details',
            id: 'details',
            accessor: 'details'
        }, {
            minWidth: colWidth.payType,
            header: 'Payment type',
            id: 'payment_type',
            accessor: 'paymentType'
        }];

        const inputProps = {
            className: 'transaction-inputs'
        }
        const dateInputProps = {
            className: 'transaction-inputs PDDatePicker'
        }
        let tableOptions = {
            className: 'PDTable',
            columns: columns,
            data: this.state.payments,
            loading: this.state.loading,
            resizable: true,
            showPagination: false,
            noDataText: 'No payments had been made on this date',
            loadingText: '...LOADING'
        };
        return(
            <div className="maintenance-dashboard">
                <div className="section-header">
                    <h1>Transactions</h1>
                </div>
                <div>
                    <div className="transaction-inputs__wrapper">
                        <PrevButton {...inputProps}/>
                        <DateInput {...dateInputProps}/>
                        <NextButton {...inputProps}/>
                    </div>
                    <ReactTable {...tableOptions}/>
                </div>
            </div>
        )
    }
}