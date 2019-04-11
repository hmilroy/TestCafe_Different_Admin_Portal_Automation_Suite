import React from 'react';
import ReactTable from 'react-table';
import _ from 'underscore';

import Maintenance from '../../../services/MaintenanceService.js';
import PropertyAction from '../../../actions/ProepertyActions';
import LoginAction from '../../../actions/LoginActions';
import PersonAction from '../../../actions/PersonActions';
import OptimalHash from '../../../utility/optimus.js';

import 'react-table/react-table.css';
import '../dashboard.scss';
import './maintenance.scss';

const columns = [{
    header: 'Status (Days',
    accessor: 'status'
}, {
    header: 'Date Created',
    accessor: 'date'
}, {
    header: 'Property',
    accessor: 'address'
}, {
    header: 'Tenant',
    accessor: 'tenant'
}, {
    header: 'Area',
    accessor: 'area'
}, {
    header: 'Problem',
    accessor: 'problem'
}];

const STATUS = [
    {
        id: 0,
        name: 'To Do'
    },
    {
        id:1,
        name: 'Done'
    },
    {
        id: 2,
        name: 'In Progress'
    },
    {
        id: 3,
        name: 'Waiting For System Approval'
    },
    {
        id: 4,
        name: 'Tradie Assigned'
    },
    {
        id: 5,
        name: 'Waiting For Owner Approval'
    }
];

export default class Properties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            pages: -1,
            data: [],
            page: 0,
            loading: true,
            pageIndex: 0
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        let self = this;
        Maintenance.getAllMaintenance(1)
            .then(function (value) {
                let pages = Math.ceil(value.data.count / 10);
                let data = [];

                value.data.rows.map(row => {
                    let days =  Math.floor((Date.now() - new Date(row.createdAt)) / (1000*60*60*24));
                    let status = _.findWhere(STATUS, {id: row.workingStatus});
                    data.push({
                        status: status.name + ' (' + days + ')',
                        address: row.property.streetAddress,
                        propertyId: OptimalHash.encode(row.property.id),
                        tenant: row.tenant.name,
                        tenantId: OptimalHash.encode(row.tenant.id),
                        date: row.createdAt.split('T')[0],
                        area: row.problemArea,
                        problem: row.problem
                    });
                });

                self.setState({
                    count: value.data.count,
                    pages: pages,
                    data: data,
                    loading: false
                });
            })
            .catch(error => {
                if(error.status === 401) {
                    LoginAction.logoutUser();
                } else {
                    Toastr.error(JSON.parse(error.response).status.message)
                }
            })
    }

    fetchData(pageIndex) {
        this.setState({loading: true});
        let self = this;
        let pageNumber = pageIndex + 1;
        Maintenance.getAllMaintenance(pageNumber)
            .then(function (value) {
                let resultArray = value.data.rows;
                let data = [];

                resultArray.map(row => {
                    let days =  Math.floor((Date.now() - new Date(row.createdAt)) / (1000*60*60*24));
                    let status = _.findWhere(STATUS, {id: row.workingStatus});
                    data.push({
                        status: status.name + ' (' + days + ')',
                        address: row.property.streetAddress,
                        propertyId: OptimalHash.encode(row.property.id),
                        tenant: row.tenant.name,
                        tenantId: OptimalHash.encode(row.tenant.id),
                        date: row.createdAt.split('T')[0],
                        area: row.problemArea,
                        problem: row.problem
                    });
                });
                self.setState({
                    pageIndex: pageIndex,
                    data: data,
                    loading: false
                });
            })
            .catch(LoginAction.logoutUser)
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                if (column.id === 'address') {
                    PropertyAction.viewProperty(rowInfo.row.propertyId);
                    this.props.router.push('view-property/' + rowInfo.row.propertyId + '/maintenance');
                }  else if (column.id === 'tenant') {
                    PersonAction.viewPerson(rowInfo.row.tenantId, 'tenant');
                    this.props.router.push('view-person/' + rowInfo.row.tenantId + '/tenant');
                }
            }
        }
    }

    render() {
        return (
            <div className="maintenance-dashboard">
                <div className="section-header">
                    <h1>MAINTENANCE REQUESTS <span>{this.state.count}</span></h1>
                </div>
                <ReactTable data={this.state.data}
                            columns={columns}
                            pages={this.state.pages}
                            page={this.state.pageIndex}
                            getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                            defaultPageSize={10}
                            showPagination={true}
                            showPageSizeOptions={false}
                            onPageChange={this.fetchData}
                            loading={this.state.loading}
                            manual/>
            </div>
        );
    }
}
