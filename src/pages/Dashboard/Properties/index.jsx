import React from 'react';
import ReactTable from 'react-table';
import _ from 'underscore';
import Property from '../../../services/PropertiesServices.js';
import AuthService from '../../../services/AuthService.js';
import PropertyAction from '../../../actions/ProepertyActions';
import PersonAction from '../../../actions/PersonActions';
import OptimalHash from '../../../utility/optimus.js';
import Toastr from 'toastr';
import Percentage from './percentage.jsx';
import 'react-table/react-table.css';
import '../dashboard.scss';
import './properties.scss';
import ReactPaginate from 'react-paginate';
import {handleError} from '../../../utility/helpers';

const columns = [{
    header: 'Address',
    accessor: 'address',
    minWidth: 190
}, {
    header: 'Owner',
    accessor: 'owner'
}, {
    header: 'Tenant',
    accessor: 'tenant'
}, {
    header: 'Start Date',
    accessor: 'date'
}, {
    header: 'Completion',
    accessor: 'takeover_percentage'
}];


export default class Properties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            pages: -1,
            data: [],
            page: 0,
            loading: true
        };

        this.fetchData = this.fetchData.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount() {
        let self = this;
        Property.getAllProperties()
            .then(function (value) {
                let tableData = value.status.data.rows;
                let count = value.status.data.count;
                let pages = Math.ceil(count / 50);
                let data = [];

                tableData.map(property => {
                    let formattedAddress = property.addr_street_address.substring(0, property.addr_street_address.toUpperCase().indexOf(', ' + property.addr_suburb.toUpperCase()));
                    let owner = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .PropertyOwner.User.name : '-';
                    let date = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).agreement_start_at
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .agreement_start_at.split('T')[0] : '-';
                    let tenant = property.Leases && _.findWhere(property.Leases,
                        {primary_lease_id: null, status: 1}) && _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User
                        ? _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User.name : '-';
                    let ownerId = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .PropertyOwner.User.id : -1;
                    let tenantId = property.Leases && _.findWhere(property.Leases,
                        {primary_lease_id: null, status: 1}) && _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User
                        ? _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User.id : -1;

                    let takeover_percentage = 0;
                    if (!_.isUndefined(property.PropertyTakeOver) && !_.isNull(property.PropertyTakeOver) && !_.isUndefined(property.PropertyTakeOver.percentage) && !_.isNull(property.PropertyTakeOver.percentage)) {
                        takeover_percentage = property.PropertyTakeOver.percentage;
                    }

                    let primaryOwner = _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null});
                    let isMaaSigned = false;
                    if (primaryOwner.is_maa_completed === 3 || primaryOwner.is_maa_completed === 4) {
                        isMaaSigned = true;
                    }
                    let percentage = null;
                    if (property.has_tenant_at_management_start && isMaaSigned) {
                        percentage = <Percentage amount={takeover_percentage}/>;
                    }

                    data.push({
                        owner,
                        date,
                        address: formattedAddress,
                        ownerId: OptimalHash.encode(ownerId),
                        tenant: tenant,
                        tenantId: OptimalHash.encode(tenantId),
                        propertyId: OptimalHash.encode(property.id),
                        takeover_percentage: percentage
                    });
                });

                self.setState({
                    count,
                    pages,
                    data,
                    loading: false
                });
            })
            .catch(function(error) {
                if (error.status === 401 || error.status  === 0) {
                    AuthService.logout();
                } else {
                    console.log(error);
                    Toastr.error("Something went wrong, please contact administrator");
                }
            })
    }

    handlePageChange(data) {
        this.fetchData(data.selected);
    }

    fetchData(pageIndex) {
        this.setState({loading: true});
        let self = this;
        let limit = 50;
        let pageNumber = pageIndex + 1;
        Property.getAllProperties(limit, pageNumber)
            .then(function (value) {
                let tableData = value.status.data.rows;
                let data = [];

                tableData.map(property => {
                    let formattedAddress = property.addr_street_address.substring(0, property.addr_street_address.indexOf(', ' + property.addr_suburb));

                    let owner = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .PropertyOwner.User.name : '-';
                    let tenant = property.Leases && _.findWhere(property.Leases,
                        {primary_lease_id: null, status: 1}) && _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User
                        ? _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User.name : '-';
                    let ownerId = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).PropertyOwner
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .PropertyOwner.User.id : -1;
                    let tenantId = property.Leases && _.findWhere(property.Leases,
                        {primary_lease_id: null, status: 1}) && _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User
                        ? _.findWhere(property.Leases, {primary_lease_id: null, status: 1}).User.id : -1;

                    let takeover_percentage = 0;
                    if (!_.isUndefined(property.PropertyTakeOver) && !_.isNull(property.PropertyTakeOver) && !_.isUndefined(property.PropertyTakeOver.percentage) && !_.isNull(property.PropertyTakeOver.percentage)) {
                        takeover_percentage = property.PropertyTakeOver.percentage;
                    }

                    let primaryOwner = _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null});
                    let isMaaSigned = false;
                    if (primaryOwner.is_maa_completed === 3 || primaryOwner.is_maa_completed === 4) {
                        isMaaSigned = true;
                    }
                    let percentage = null;
                    if (property.has_tenant_at_management_start === 1 && isMaaSigned) {
                        percentage = <Percentage amount={takeover_percentage}/>
                    }

                    let date = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                        {primary_property_ownership_id: null}).agreement_start_at
                        ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                            .agreement_start_at.split('T')[0] : '-';

                    data.push({
                        address: formattedAddress,
                        owner: owner,
                        ownerId: OptimalHash.encode(ownerId),
                        tenant: tenant,
                        tenantId: OptimalHash.encode(tenantId),
                        propertyId: OptimalHash.encode(property.id),
                        date: date,
                        takeover_percentage: percentage
                    });
                });

                self.setState({
                    page: pageIndex,
                    data: data,
                    loading: false
                });
            })
            .catch(error => {
                handleError(error);
            });
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                if (column.id === 'address') {
                    PropertyAction.viewProperty(rowInfo.row.propertyId);
                    this.props.router.push('view-property/' + rowInfo.row.propertyId);
                } else if (column.id === 'owner') {
                    PersonAction.viewPerson(rowInfo.row.ownerId, 'owner');
                    this.props.router.push('view-person/' + rowInfo.row.ownerId + '/owner');
                } else if (column.id === 'tenant') {
                    PersonAction.viewPerson(rowInfo.row.tenantId, 'tenant');
                    this.props.router.push('view-person/' + rowInfo.row.tenantId + '/tenant');
                }
            }
        }
    }

    render() {
        if (!this.state) {
            Property.getAllProperties()
                .then(function (value) {
                    let tableData = value.status.data.rows;
                    let count = value.status.data.count;
                    let pages = Math.ceil(count / 50);
                    let data = [];

                    tableData.map(property => {
                        let formattedAddress = property.address_line1 + ' ' + property.address_line2 + ' '
                            + property.address_line3 + ' ' + property.city + ' ' + property.state + ' ' + property.zip_code;

                        let owner = property.PropertyOwnership && property.PropertyOwnership.PropertyOwner.User
                            ? property.PropertyOwnership.PropertyOwner.User.name : '-';
                        let tenant = property.Lease && property.Lease.User
                            ? property.Lease.User.name : '-';
                        let ownerId = property.PropertyOwnership && property.PropertyOwnership.PropertyOwner.User
                            ? property.PropertyOwnership.PropertyOwner.User.id : -1;
                        let tenantId = property.Lease && property.Lease.User
                            ? property.Lease.User.id : -1;

                        let date = property.PropertyOwnerships && _.findWhere(property.PropertyOwnerships,
                            {primary_property_ownership_id: null}).agreement_start_at
                            ? _.findWhere(property.PropertyOwnerships, {primary_property_ownership_id: null})
                                .agreement_start_at.split('T')[0] : '-';

                        data.push({
                            address: formattedAddress,
                            owner: owner,
                            ownerId: OptimalHash.encode(ownerId),
                            tenant: tenant,
                            tenantId: OptimalHash.encode(tenantId),
                            propertyId: OptimalHash.encode(property.id),
                            date: date
                        });
                    });

                    self.setState({
                        count: count,
                        pages: pages,
                        data: data,
                        loading: false
                    });
                });
        }

        let paginateProps = {
            containerClassName: "DA-Pagination",
            pageClassName: "DA-Pagination__page DA-Pagination__item",
            breakClassName: "DA-Pagination__dots DA-Pagination__item-note DA-Pagination__pageLink-note",
            pageLinkClassName: "DA-Pagination__pageLink",
            activeClassName: "DA-Pagination__item--active",
            previousClassName: "DA-Pagination__btn DA-Pagination__btn--prev DA-Pagination__item",
            previousLinkClassName: "DA-Pagination__prev--link DA-Pagination__pageLink",
            nextClassName: "DA-Pagination__btn DA-Pagination__btn--next DA-Pagination__item",
            nextLinkClassName: "DA-Pagination__next--link DA-Pagination__pageLink",
            disabledClassName: "DA-Pagination__item--disabled",
            previousLabel: '<',
            nextLabel: '>',
        };

        const breakLabel = <a className="DA-Pagination__pageLink">...</a>;
        return (
            <div className="DA-PropertyUnderManagementContainer">
                <div>
                    <div className="section-header">
                        <h1>Properties Under Management <span>{this.state.count}</span></h1>
                    </div>
                    <ReactTable data={this.state.data}
                                columns={columns}
                                pages={this.state.pages}
                                page={this.state.page}
                                getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                                defaultPageSize={50}
                                showPagination={true}
                                showPageSizeOptions={false}
                                onPageChange={this.fetchData}
                                loading={this.state.loading}
                                className="dashboardPropertyTable"
                                manual/>


                </div>
                <div className="DA-PaginationContainer">
                    <ReactPaginate
                        {...paginateProps}
                        pageCount={this.state.pages}
                        pageRangeDisplayed={2}
                        breakLabel={breakLabel}
                        onPageChange={this.handlePageChange}/>
                </div>
            </div>

        );
    }
}
