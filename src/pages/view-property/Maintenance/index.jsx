import React from 'react';
import ReactTable from 'react-table';
import _ from 'underscore';

import Maintenance from '../../../services/MaintenanceService.js';
import PropertyAction from '../../../actions/ProepertyActions';
import PersonAction from '../../../actions/PersonActions';
import PropertyStore from '../../../stores/PropertyStore';
import OptimalHash from '../../../utility/optimus.js';
import PropertiesServices from '../../../services/PropertiesServices.js';

import 'react-table/react-table.css';
import './maintenance.scss';

const columns = [{
    header: 'Status (Days)',
    accessor: 'status'
}, {
    header: 'Date Created',
    accessor: 'date'
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
            address: ''
        };
    }

    componentDidMount() {
        let self = this;
        let propertyId = OptimalHash.decode(self.props.params.id); 
        PropertiesServices.viewProperty(propertyId)
            .then(function (value) {
                self.setState({
                    address: value.status.data.addr_street_address
                });
            });
        Maintenance.getMaintenance(propertyId)
            .then(function (value) {
                let count = value.data.count;
                let data = [];

                value.data.rows.map(row => {
                    let days =  Math.floor((Date.now() - new Date(row.createdAt)) / (1000*60*60*24));
                    let status = _.findWhere(STATUS, {id: row.workingStatus});
                    data.push({
                        status: status.name + ' (' + days + ')',
                        tenant: row.tenant.name,
                        tenantId: row.tenant.id,
                        date: row.createdAt.split('T')[0],
                        area: row.problemArea,
                        problem: row.problem
                    });
                });

                let address = '';
                if (!_.isEmpty(value.data.rows)) {
                    address = value.data.rows[0].property.streetAddress;
                }
                self.setState({
                    count: count,
                    data: data,
                    loading: false,
                    address: address
                });
            });
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                if (column.id === 'address') {
                    PropertyAction.viewProperty(rowInfo.row.propertyId);
                    this.props.router.push('view-property/' + OptimalHash.encode(rowInfo.row.propertyId));
                }  else if (column.id === 'tenant') {
                    PersonAction.viewPerson(rowInfo.row.tenantId, 'tenant');
                    this.props.router.push('view-person/' + OptimalHash.encode(rowInfo.row.tenantId) + '/tenant');
                }
            }
        }
    }

    render() {
        return (
            <div className="admin-padding-adjustment maintenance-dashboard-property">
                <div className="section-header">
                    <h1>{this.state.address}<i className="oval"/>
                        <span className="document">MAINTENANCE</span></h1>
                </div>
                <ReactTable data={this.state.data}
                            columns={columns}
                            getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                            defaultPageSize={this.state.count}
                            showPagination={true}
                            loading={this.state.loading}/>
                <form className="add-maintenance">
                    <button className="button save-button" type="submit" value="Add Tenant">
                        Add Maintenance Request</button>
                </form>
            </div>
        );
    }
}
