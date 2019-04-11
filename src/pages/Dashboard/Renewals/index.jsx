import React from 'react';
import ReactTable from 'react-table';
import {CSVLink, CSVDownload} from 'react-csv';
import _ from 'underscore';
import Property from '../../../services/ReportServices.js';
import AuthService from '../../../services/AuthService.js';
import ReportsAction from '../../../actions/ReportActions';
import PersonAction from '../../../actions/PersonActions';
import OptimalHash from '../../../utility/optimus.js';
import reportDownloadIcon from '../../../assets/images/report_download.png';
import reportViewAsMapIcon from '../../../assets/images/report_view_map.png';
import leasedIcon from '../../../assets/images/leased.svg';
import openhomeIcon from '../../../assets/images/open_home.svg';
import accessNotesIcon from '../../../assets/images/access_notes.svg';
import clockIcon from '../../../assets/images/clock.png';
import closeIcon from '../../../assets/images/cancel.png';
import Toastr from 'toastr';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import Dialog from 'material-ui/Dialog';
import DatePicker from '../../../components/elements/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Select from '../../../components/elements/Select.jsx';
import 'react-table/react-table.css';
import '../dashboard.scss';
import './renewals.scss';
import { handleError } from '../../../utility/helpers';
import apiConstants from '../../../constants/apiConstants';

const MAP_API_KEY = apiConstants.GOOGLE.MAP_API_KEY;

const columnsLeaseRenewals = [{
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Tenant',
    accessor: 'tenant',
    className: 'clickable wd-25',
    headerClassName: 'wd-25',
}, {
    header: 'Weekly Rent',
    accessor: 'weekly_rent',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Lease Start',
    accessor: 'lease_start',
    className: 'wd-10',
    headerClassName: 'wd-10',
}, {
    header: 'Lease End',
    accessor: 'lease_end',
    className: 'wd-10',
    headerClassName: 'wd-10',
}];
const LeaseRenewalsHeaders = [
  {
    label: 'Address',
    key: 'address'
  }, {
    label: 'Tenant',
    key: 'tenant'
  }, {
    label: 'Tenant Email',
    key: 'tenantEmail'
  }, {
    label: 'Weekly Rent',
    key: 'weekly_rent'
  }, {
    label: 'Lease Start',
    key: 'lease_start'
  }, {
    label: 'Lease End',
    key: 'lease_end'
  },
];

const columnsLandlordInsurance = [{
    header: 'Name',
    accessor: 'owner',
    className: 'clickable wd-25',
    headerClassName: 'wd-25',
}, {
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Insurance start date',
    accessor: 'agreement_start_at',
    className: 'wd-20',
    headerClassName: 'wd-20',
}, {
    header: 'Vacant at start',
    accessor: 'has_tenant_at_management_start',
    className: 'wd-20',
    headerClassName: 'wd-20',
}];
const LandlordInsuranceHeaders = [
  {
    label: 'Name',
    key: 'owner'
  }, {
    label: 'Address',
    key: 'address'
  }, {
    label: 'Agreement start at',
    key: 'agreement_start_at'
  }, {
    label: 'Has tenant at management start',
    key: 'has_tenant_at_management_start'
  },
];

const columnsPropertiesWon = [{
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Owner',
    accessor: 'owner',
    className: 'clickable wd-20',
    headerClassName: 'wd-20',
}, {
    header: 'Status',
    accessor: 'status',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Created',
    accessor: 'created',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Signed',
    accessor: 'signed',
    className: 'wd-15',
    headerClassName: 'wd-15',
}];
const PropertiesWonHeaders = [
  {
    label: 'Address',
    key: 'address'
  }, {
    label: 'Owner',
    key: 'owner'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Created',
    key: 'created'
  }, {
    label: 'Signed',
    key: 'signed'
  },
];

const columnsUpcomingOpenhomes = [{
    header: 'Key number',
    accessor: 'key_no',
    className: 'wd-10',
    headerClassName: 'wd-10',
}, {
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Date',
    accessor: 'date_format',
    className: 'wd-20',
    headerClassName: 'wd-20',
    render: ({ row }) => (
      <div>
        { row.date }
      </div>
    )
}, {
    header: 'Start time',
    accessor: 'start_time',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Shown by',
    accessor: 'shown_by',
    className: 'wd-20',
    headerClassName: 'wd-20',
}];
const UpcomingOpenhomesHeaders = [
  {
    label: 'Key number',
    key: 'key_no'
  }, {
    label: 'Address',
    key: 'address'
  }, {
    label: 'Date',
    key: 'date'
  }, {
    label: 'Start time',
    key: 'start_time'
  }, {
    label: 'Shown by',
    key: 'shown_by'
  },
];

const columnsPropertiesAvailableToLet = [{
    header: 'Key',
    accessor: 'key_no',
    className: 'wd-10',
    headerClassName: 'wd-10',
}, {
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Date available',
    accessor: 'date',
    className: 'wd-15',
    headerClassName: 'wd-15',
    render: ({ row }) => (
      <div>
        { row.available_date }
      </div>
    )
}, {
    header: 'Rent',
    accessor: 'rent',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Opens',
    accessor: 'opens',
    className: 'wd-10',
    headerClassName: 'wd-10',
}, {
    header: null,
    headerClassName: 'action_table_header wd-15',
    className: 'wd-15',
    render: ({ row }) => (
      <div>
        <button
          className="btn-propertiesavailable-actions"
          onClick={(e) => Renewals.openMarkedAsLeasedModel(row)}>
            <img src={leasedIcon} />
        </button>
        <button
          className="btn-propertiesavailable-actions"
          onClick={(e) => Renewals.openAddOpenHomeModel(row)}>
            <img src={openhomeIcon} />
        </button>
        <button
          className="btn-propertiesavailable-actions"
          onClick={(e) => Renewals.openAccessNotesModel(row)}>
            <img src={accessNotesIcon} />
        </button>
      </div>
    )
}];
const PropertiesAvailableToLetHeaders = [
  {
    label: 'Key',
    key: 'key_no'
  }, {
    label: 'Address',
    key: 'address'
  }, {
    label: 'Date available',
    key: 'available_date'
  }, {
    label: 'Start time',
    key: 'start_time'
  }, {
    label: 'Rent (Min-Max)',
    key: 'rent'
  }, {
    label: 'Opens',
    key: 'opens'
  },
];

const columnsComingSoon = [{
    header: 'Coming soon',
    className: 'wd-100',
    headerClassName: 'wd-100',
}];
const ComingSoonHeaders = [
  {
    label: 'Coming soon',
    key: 'Coming soon'
  }
];

const shownByList = [
  {
    id : 0,
    name: 'loading'
  }
];
const durationList = [
  {
    id : 0,
    value: 15
  },
  {
    id : 1,
    value: 30
  },
  {
    id : 2,
    value: 45
  },
  {
    id : 3,
    value: 60
  },
  {
    id : 4,
    value: 75
  },
  {
    id : 5,
    value: 90
  }
];
const columnsOpenVerbals = [{
    header: 'Address',
    accessor: 'address',
    className: 'clickable wd-35',
    headerClassName: 'wd-35',
}, {
    header: 'Owner',
    accessor: 'owner',
    className: 'clickable wd-25',
    headerClassName: 'wd-25',
}, {
    header: 'Status',
    accessor: 'status',
    className: 'wd-10',
    headerClassName: 'wd-10',
}, {
    header: 'Created',
    accessor: 'created',
    className: 'wd-15',
    headerClassName: 'wd-15',
}, {
    header: 'Signed',
    accessor: 'signed',
    className: 'wd-15',
    headerClassName: 'wd-15',
}];

const openVerbalHeaders = [
    {
        label: 'Address',
        key: 'address'
    },
    {
        label: 'Owner',
        key: 'owner'
    },
    {
        label: 'Status',
        key: 'status'
    },
    {
        label: 'Created',
        key: 'created'
    },
    {
        label: 'Signed',
        key: 'signed'
    }
];

export default class Renewals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            pages: -1,
            data: [],
            columns: {columnsLeaseRenewals}.columnsLeaseRenewals,
            reportName:'',
            page: 0,
            selectedReport:'lease_renewals',
            openModal: false,
            openMap: false,
            openedModal: '',
            shown_by_list: shownByList,
            duration_list: durationList,
            address: '',
            isEditing: false,
            note: '',
            property_id: 0,
            selectedTime: new Date(),
            selectedDate: new Date(),
            selectedShownBy: null,
            selectedDuration: 15,
            modelTitle: '',
            modelActions: [],
            center: {
             lat: -33.86,
             lng: 151.20
            },
            zoom: 12,
            selectedMapPropertyIndex: null,
            loading: true
        };

        this.fetchData = this.fetchData.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.selectReport = this.selectReport.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleModelClose = this.handleModelClose.bind(this);
        this.handleMapOpen = this.handleMapOpen.bind(this);
        this.openMapInNewTab = this.openMapInNewTab.bind(this);
        this.handleMapClose = this.handleMapClose.bind(this);
        this.handleSelectMapProperty = this.handleSelectMapProperty.bind(this);
        this.handleBoundsChange = this.handleBoundsChange.bind(this);
        Renewals.handleSelectMapProperty = this.handleSelectMapProperty.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.handleNoteSave = this.handleNoteSave.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.addOpenHome = this.addOpenHome.bind(this);
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onShownByChange = this.onShownByChange.bind(this);
        Renewals.openMarkedAsLeasedModel = this.openMarkedAsLeasedModel.bind(this);
        Renewals.openAddOpenHomeModel = this.openAddOpenHomeModel.bind(this);
        Renewals.openAccessNotesModel = this.openAccessNotesModel.bind(this);
    }

    componentDidMount() {
        let report = 'lease_renewals' ;
        if (this.props.params.report) {
          report = this.props.params.report;
        }
        this.getShownByList();
        this.selectReport(report);
        if (this.props.params.map) {
          this.handleMapOpen();
        }
    }

    getLeaseRenewals() {
      let self = this;
      Property.getLeaseRenewals()
        .then(function (value) {
            let tableData = value.status.data.rows;
            let count = value.status.data.count;
            let columns = {columnsLeaseRenewals}.columnsLeaseRenewals;
            let headers = LeaseRenewalsHeaders;
            let reportName = "Lease Renewals Report.csv";
            let reportTitle = "Lease Renewals";
            let pages = Math.ceil(count / 50);
            let data = [];
            tableData.map(property => {
                let formattedAddress = '-';
                if (property.addr_street_address) {
                  formattedAddress = property.addr_street_address.substring(0, property.addr_street_address.indexOf(', ' + property.addr_suburb));
                }

                let weekly_rent = '-';
                if (property.current_weekly_rent) {
                  weekly_rent = property.current_weekly_rent;
                }

                let lease_start = '-';
                if (property.Leases && _.findWhere(property.Leases, {primary_lease_id: null}).lease_start_date) {
                  lease_start = _.findWhere(property.Leases, {primary_lease_id: null}).lease_start_date;
                  lease_start = moment(lease_start).format("YYYY-MM-DD");
                }

                let lease_end = '-';
                if (property.Leases && _.findWhere(property.Leases, {primary_lease_id: null}).lease_end_date) {
                  lease_end = _.findWhere(property.Leases, {primary_lease_id: null}).lease_end_date;
                  lease_end = moment(lease_end).format("YYYY-MM-DD");
                }

                let tenant = '-';
                if (property.Leases && _.findWhere(property.Leases, {primary_lease_id: null})) {
                  tenant = _.findWhere(property.Leases, {primary_lease_id: null}).User.name;
                }

                let tenantId = -1;
                if (property.Leases && _.findWhere(property.Leases, {primary_lease_id: null})) {
                  tenantId = _.findWhere(property.Leases, {primary_lease_id: null}).User.id;
                }

                let tenantEmail = '-';
                if (property.Leases && _.findWhere(property.Leases, {primary_lease_id: null})) {
                  tenantEmail = _.findWhere(property.Leases, {primary_lease_id: null}).User.email;
                }

                data.push({
                    address: formattedAddress,
                    weekly_rent: weekly_rent,
                    lease_start: lease_start,
                    lease_end: lease_end,
                    tenant: tenant,
                    tenantId: OptimalHash.encode(tenantId),
                    propertyId: OptimalHash.encode(property.id),
                    tenantEmail: tenantEmail
                });
            });

            self.setState({
                count : count,
                pages : pages,
                data : data,
                columns : columns,
                headers : headers,
                reportName : reportName,
                reportTitle : reportTitle,
                loading: false
            });
        })
        .catch(handleError);
    }

    getLandlordInsurance() {
      let self = this;
      Property.getLandlordInsurance()
        .then(function (value) {
            let tableData = value.status.data.rows;
            let count = 0;
            let columns = {columnsLandlordInsurance}.columnsLandlordInsurance;
            let reportName = "Landlord Insurance Report.csv";
            let reportTitle = "Landlord Insurance";
            let headers = LandlordInsuranceHeaders;
            let pages = Math.ceil(count / 50);
            let data = [];
            tableData.map(property => {
              for (var i = 0; i < property.PropertyOwnerships.length; i++) {
              let owner = '-';
              let ownerId = '-';
              if (property.User) {
                owner = property.User.name;
                ownerId = property.User.id;
              }
              let agreement_start_at = '-';
              if (property.PropertyOwnerships[i].agreement_start_at) {
                agreement_start_at = property.PropertyOwnerships[i].agreement_start_at;
                agreement_start_at = moment(agreement_start_at).format("YYYY-MM-DD");
              }
              let address = '-';
              if (property.PropertyOwnerships[i].Property.addr_street_address) {
                address = property.PropertyOwnerships[i].Property.addr_street_address;
              }
              let has_tenant_at_management_start = '-';
              let has_tenant_at_management_start_get_val = '-';
              if (property.PropertyOwnerships[i].Property) {
                has_tenant_at_management_start_get_val = property.PropertyOwnerships[i].Property.has_tenant_at_management_start;
                if (has_tenant_at_management_start_get_val == '0') {
                  has_tenant_at_management_start = 'No';
                }
                if (has_tenant_at_management_start_get_val == '1') {
                  has_tenant_at_management_start = 'Yes';
                }
              }

                data.push({
                    owner: owner,
                    agreement_start_at: agreement_start_at,
                    address: address,
                    propertyId: OptimalHash.encode(property.PropertyOwnerships[0].Property.id),
                    ownerId: OptimalHash.encode(ownerId),
                    has_tenant_at_management_start: has_tenant_at_management_start,
                });
              }
            });

            count = data.length;

            self.setState({
                count : count,
                pages : pages,
                data : data,
                columns : columns,
                headers : headers,
                reportName : reportName,
                reportTitle : reportTitle,
                loading: false
            });
        })
        .catch(handleError);
    }

    getPropertiesWon() {
      let self = this;
      Property.getPropertiesWon()
        .then(function (value) {
            let tableData = value.status.data.rows;
            let count = 0;
            let columns = {columnsPropertiesWon}.columnsPropertiesWon;
            let reportName = "Properties Won Report.csv";
            let reportTitle = "Properties Won";
            let headers = PropertiesWonHeaders;
            let pages = Math.ceil(count / 50);
            let data = [];

            tableData.map(property => {
            for (var i = 0; i < property.PropertyOwnerships.length; i++) {
              let owner = '-';
              let ownerId = '-';
              if (property.User) {
                owner = property.User.name;
                ownerId = property.User.id;
              }
              let address = '-';
              if (property.PropertyOwnerships[i].Property.addr_street_address) {
                address = property.PropertyOwnerships[i].Property.addr_street_address;
              }
              let status = '-';
              if (property.PropertyOwnerships[i].is_maa_completed) {
                status = property.PropertyOwnerships[i].is_maa_completed;
              }
              let created = '-';
              if (property.PropertyOwnerships[i].created_at) {
                created = property.PropertyOwnerships[i].created_at;
                created = moment(created).format("YYYY-MM-DD");
              }
              let signed = '-';
              if (property.PropertyOwnerships[i].signed_date) {
                signed = property.PropertyOwnerships[i].signed_date;
                signed = moment(signed).format("YYYY-MM-DD");
              }

              data.push({
                  owner: owner,
                  address: address,
                  propertyId: OptimalHash.encode(property.PropertyOwnerships[i].Property.id),
                  ownerId: OptimalHash.encode(ownerId),
                  status:status,
                  created:created,
                  signed:signed,
              });
            }
            });

            count = data.length;

            self.setState({
                count : count,
                pages : pages,
                data : data,
                columns : columns,
                headers : headers,
                reportName : reportName,
                reportTitle : reportTitle,
                loading: false
            });
        })
        .catch(handleError);
    }

    getUpcomingOpenhomes() {
      let self = this;
      Property.getUpcomingOpenhomes()
        .then(function (value) {
            let tableData = value.data.upcomingOpenHomes;
            let count = value.data.count;
            let columns = {columnsUpcomingOpenhomes}.columnsUpcomingOpenhomes;
            let reportName = "Upcoming Open Homes Report.csv";
            let reportTitle = "Upcoming Open Homes";
            let headers = UpcomingOpenhomesHeaders;
            let pages = Math.ceil(count / 50);
            let data = [];
            tableData.map(property => {
              let key_no = '-';
              if (property.key_no) {
                key_no = property.key_no;
              }
              let address = '-';
              if (property.address.addr_street_address) {
                address = property.address.addr_street_address.substring(0, property.address.addr_street_address.indexOf(', ' + property.address.addr_suburb));
              }
              let start_time = '-';
              if (property.time) {
                start_time = property.time;
              }
              let date = '-';
              let date_format = '-';
              if (property.date) {
                date = property.date;
                date_format = moment(date).format("YYYY-MM-DD");
              }
              let shown_by = '-';
              if (property.shown_by) {
                shown_by = property.shown_by;
              }

              data.push({
                  key_no: key_no,
                  address: address,
                  propertyId: OptimalHash.encode(property.property_id),
                  start_time: start_time,
                  date: date,
                  date_format: date_format,
                  shown_by: shown_by,
              });
            });

            self.setState({
                count : count,
                pages : pages,
                data : data,
                columns : columns,
                headers : headers,
                reportName : reportName,
                reportTitle : reportTitle,
                loading: false
            });
        })
        .catch(handleError);
    }

    getOpenVerbals() {
        let _this = this;
        Property.getOpenVerbals()
            .then(value => {
                const { data } = value.status;
                const count = data.length;
                const reportName = "Open Verbals Report.csv";
                const reportTitle = "Open Verbals";
                const pages = Math.ceil(count / 50);
                let records = [];

                data.map(record => {
                    const { id, addr_street_address, addr_suburb, PropertyOwnerships } = record;
                    const { is_maa_completed, created_at, signed_date, PropertyOwner } = PropertyOwnerships[0];
                    const { User } = PropertyOwner;
                    records.push({
                        propertyId: OptimalHash.encode(id),
                        address: addr_street_address && addr_suburb ? addr_street_address.substring(0, addr_street_address.indexOf(', ' + addr_suburb)) : addr_street_address,
                        ownerId: OptimalHash.encode(User.id),
                        owner: User.name ? User.name : '-',
                        status: is_maa_completed ? is_maa_completed : '-',
                        created: created_at ? moment(created_at).format("YYYY-MM-DD") : '-',
                        signed: signed_date ? moment(signed_date).format("YYYY-MM-DD") : '-'
                    })
                });

                _this.setState({
                    count,
                    pages,
                    data: records,
                    columns: columnsOpenVerbals,
                    headers: openVerbalHeaders,
                    reportName,
                    reportTitle,
                    loading: false
                })
            })
            .catch(handleError);
    }

    getPropertiesAvailableToLet() {
      let self = this;
      Property.getPropertiesAvailableToLet()
        .then(function (value) {
            let tableData = value.data.propertiesAvailableToLet;
            let count = value.data.count;
            let columns = {columnsPropertiesAvailableToLet}.columnsPropertiesAvailableToLet;
            let reportName = "Properties Available to Let Report.csv";
            let reportTitle = "Properties Available to Let";
            let headers = PropertiesAvailableToLetHeaders;
            let pages = Math.ceil(count / 50);
            let data = [];
            tableData.map(property => {
              let key_no = '-';
              if (property.key_no) {
                key_no = property.key_no;
              }
              let address = '-';
              if (property.address.addr_street_address) {
                address = property.address.addr_street_address.substring(0, property.address.addr_street_address.indexOf(', ' + property.address.addr_suburb));
              }
              let location = '-';
              if (property.address.addr_location) {
                location = JSON.parse(property.address.addr_location);
              }
              let date = '-';
              let available_date = '-';
              if (property.available_date) {
                date = property.available_date;
                available_date = moment(date).format("MMM DD, YYYY");
              }
              let rent = '-';
              if (property.rent) {
                if (property.rent.min && property.rent.max) {
                  rent = '$'+property.rent.min+' - $'+property.rent.max;
                } else if (property.rent.min) {
                  rent = '$'+property.rent.min;
                } else if (property.rent.max) {
                  rent = '$'+property.rent.max;
                }
              }
              let opens = '-';
              if (property.opens) {
                opens = property.opens;
              }

              data.push({
                  key_no: key_no,
                  address: address,
                  location: location,
                  propertyId: OptimalHash.encode(property.property_id),
                  property_id: property.property_id,
                  vacancy_id: property.vacancy_id,
                  date: date,
                  available_date: available_date,
                  rent: rent,
                  opens: opens,
              });
            });

            self.setState({
                count : count,
                pages : pages,
                data : data,
                columns : columns,
                headers : headers,
                reportName : reportName,
                reportTitle : reportTitle,
                loading: false
            });
        })
        .catch(handleError);
    }

    getShownByList() {
      let self = this;
      Property.getShownByList()
        .then(function (value) {
          let listData = value.data;
          let data = [];

          listData.map(user => {
            let id = user.id;
            let name = user.name;

            data.push({
                id: id,
                name: name,
            });
          });

          self.setState({
            shown_by_list: data,
            selectedShownBy: data[0].id
          });
        })
        .catch(handleError);
    }

    getAccessNote(propertyId) {
      Property.getAccessNote(propertyId)
        .then(function (value) {
          let note = '';
          if (value.data.note) {
            note = value.data.note;
          }

          return note;
        })
        .catch(handleError);
    }

    getInactiveLeases() {
      let self = this;
        let count = 0;
        let columns = {columnsComingSoon}.columnsComingSoon;
        let headers = ComingSoonHeaders;
        let reportName = "Inactive Leases Report.csv";
        let reportTitle = "Inactive Leases";
        let pages = Math.ceil(count / 50);
        let data = [];
        self.setState({
            count : count,
            pages : pages,
            data : data,
            columns : columns,
            headers : headers,
            reportName : reportName,
            reportTitle : reportTitle,
            loading: false
        });
    }

    getArrears() {
      let self = this;
        let count = 0;
        let columns = {columnsComingSoon}.columnsComingSoon;
        let headers = ComingSoonHeaders;
        let reportName = "Arrears Report.csv";
        let reportTitle = "Arrears";
        let pages = Math.ceil(count / 50);
        let data = [];
        self.setState({
            count : count,
            pages : pages,
            data : data,
            columns : columns,
            headers : headers,
            reportName : reportName,
            reportTitle : reportTitle,
            loading: false
        });
    }

    handlePageChange(data) {
        this.fetchData(data.selected);
    }

    fetchData(pageIndex) {
        this.setState({loading: true});
        let self = this;
        let limit = 50;
        let pageNumber = pageIndex + 1;
        this.getLeaseRenewals();
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                if (column.id === 'address') {
                    ReportsAction.viewProperty(rowInfo.row.propertyId);
                    this.props.router.push('view-property/' + rowInfo.row.propertyId + '/vacancy');
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

    openAddOpenHomeModel(row) {
      let self = this;

      let actions = [
          <button className="button bill-button" onClick={this.handleModelClose}>Cancel</button>,
          <button className="button button_main bill-button" onClick={this.addOpenHome}>Add</button>
      ];

      self.setState({
        address: row.address,
        property_id: row.property_id,
        modelTitle: 'Add open home for',
        openedModal: 'AddOpenHomeModel',
        modelActions: actions,
      });

      this.handleModelOpen();
    }

    openMarkedAsLeasedModel(row) {
      let self = this;

      let actions = [
          <button className="button bill-button" onClick={this.handleModelClose}>Cancel</button>,
          <button className="button button_main bill-button" onClick={() => {this.markedAsLeased(row)}}>Yes</button>
      ];

      self.setState({
        address: row.address,
        property_id: row.property_id,
        modelTitle: 'Do you want to mark this property as leased?',
        openedModal: 'MarkedAsLeasedModel',
        modelActions: actions,
      });

      this.handleModelOpen();
    }

    addOpenHome() {
        let data = {
            property_id: this.state.property_id,
            user_id: this.state.selectedShownBy,
            duration: this.state.selectedDuration,
            scheduled_date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
            scheduled_time: moment(this.state.selectedTime).format("HH:mm"),
        }
        Property.addOpenHome(data)
            .then((result) => {
                if (!_.isUndefined(result.status.message)) {
                    Toastr.success(result.status.message);
                }
                this.getPropertiesAvailableToLet();
                this.handleModelClose();
            })
            .catch(handleError);
    }

    openAccessNotesModel(row) {
      let self = this;
      let note = '';
      let actions = [];

      self.setState({
        address: row.address,
        property_id: row.property_id,
        modelTitle: 'Access notes for',
        openedModal: 'AccessNoteModel',
        modelActions: actions,
      });

      Property.getAccessNote(row.property_id)
        .then(function (value) {
          let note = '';
          if (value.data) {
            note = value.data.note;
          }

          self.setState({
            note: note,
          });
        })
        .catch(handleError);

      this.handleModelOpen();
    }

    markedAsLeased(row) {
        let data = {
            property_id: row.property_id,
            vacancy_id: row.vacancy_id
        }
        Property.markedAsLeased(data)
            .then((result) => {
                if (!_.isUndefined(result.status.message)) {
                    Toastr.success('<strong>' + row.address + '</strong> marked as leased');
                }
                this.getPropertiesAvailableToLet();
                this.handleModelClose();
            })
            .catch(handleError);
    }

    onStateChange(event) {
      let report = event.target.value;
      history.pushState(null, '', '/#/reports/'+report);
      this.selectReport(report);
    }

    selectReport(report) {
      if (report == 'lease_renewals') {
        this.getLeaseRenewals();
      } if (report == 'landlord_insurance') {
        this.getLandlordInsurance();
      } if (report == 'inactive_leases') {
        this.getInactiveLeases();
      } if (report == 'arrears') {
        this.getArrears();
      } if (report == 'properties_won') {
        this.getPropertiesWon();
      } if (report == 'upcoming_open_homes') {
        this.getUpcomingOpenhomes();
      } if (report == 'properties_available_to_let') {
        this.getPropertiesAvailableToLet();
      } if(report == 'open_verbals') {
        this.getOpenVerbals();
      }

      this.setState({
        selectedReport: report
      });
    }

    onDateChange(e, date) {
        this.setState({
            selectedDate: date
        })
    }

    onTimeChange(e, time) {
        this.setState({
            selectedTime: time
        })
    }

    onDurationChange(event) {
      this.setState({
        selectedDuration: event.target.value
      });
    }

    onShownByChange(event) {
      this.setState({
        selectedShownBy: event.target.value
      });
    }

    handleModelOpen() {
        this.setState({
            openModal: true
        });
    }

    handleModelClose() {
        this.setState({
            openModal: false
        });
    }

    handleMapOpen() {
        this.setState({
            openMap: true
        });
    }

    openMapInNewTab() {
        window.open('/#/reports/'+this.state.selectedReport+'/map', '_blank');
    }

    handleMapClose() {
        this.setState({
            openMap: false
        });
    }

    handleSelectMapProperty(index, property) {
        this.setState({
            selectedMapPropertyIndex: index,
            center: {
             lat: property.location.lat,
             lng: property.location.lon
            },
            zoom: 18,
        });
    }

    handleBoundsChange(center, zoom) {
      this.setState({
          zoom: zoom,
      });
    }

    handleClickEdit() {
        this.setState({
            isEditing: true
        });
    }

    handleClickCancel() {
        this.setState({
            isEditing: false
        });
    }

    handleChangeNote(e) {
        this.setState({
            note: e.target.value
        });
    }

    handleNoteSave() {
        let data = {
            property_id: this.state.property_id,
            notes: this.state.note
        }
        Property.updateAccessNote(data)
            .then((result) => {
                if (!_.isUndefined(result.status.message)) {
                    Toastr.success(result.status.message);
                }
                this.handleClickCancel();
            });
    }

    render() {
        if (!this.state) {
          this.getLeaseRenewals();
        }

        const timePickerInputStyles = {
          'opacity': '0.8',
          'color': '#686868',
          'border': 'none',
          'height': '30px',
          'width': '100%',
          'padding': '0 8px',
          'cursor': 'pointer'
        };

        const mapContainerStyles = {
          'position': 'absolute',
          'left': 0,
          'top': 0,
          'width': '70%',
          'height': '100%'
        };

        const MapPoint = ({ property, index }) =>
        <div className={this.state.selectedMapPropertyIndex == index ? 'map_point selected' : 'map_point' }>
          <div className={this.state.selectedMapPropertyIndex == index ? 'popup visible' : 'popup' }>
            <div className="header">
              {property.address}
            </div>
            <div className="footer">
              <span className="available_date">{property.available_date}</span>
               <i className="oval"></i>
              <span className="rent">{property.rent}</span>
            </div>
            <span className="popup-point"></span>
          </div>
          <div className="placeholder" onClick={() => {Renewals.handleSelectMapProperty(index, property)}}>
            <span className="placeholder_text">{index+1}</span>
          </div>
        </div>;

        return (
            <div className="DA-PropertyUnderManagementContainer">
                <div>
                    <div className="section-header reports-header">
                        <select className="selectpicker" value={this.state.selectedReport} onChange={this.onStateChange} >
                          <option value='arrears'>Arrears</option>
                          <option value='inactive_leases'>Inactive Leases</option>
                          <option value='landlord_insurance'>Landlord Insurance</option>
                          <option value='lease_renewals'>Lease Renewals</option>
                          <option value='properties_available_to_let'>Properties Available to Let</option>
                          <option value='properties_won'>Properties Won</option>
                          <option value='upcoming_open_homes'>Upcoming Open homes</option>
                          <option value='open_verbals'>Open Verbals</option>
                        </select>
                        <CSVLink
                          data={this.state.data}
                          headers={this.state.headers}
                          filename={this.state.reportName}
                          className="btn-download" >
                          <img src={reportDownloadIcon} /> DOWNLOAD AS CSV
                        </CSVLink>
                        {this.state.selectedReport == 'properties_available_to_let' &&
                        <button
                          className="btn-map"
                          onClick={(e) => this.openMapInNewTab()}>
                            <img src={reportViewAsMapIcon} /> VIEW AS MAP
                        </button>
                        }
                    </div>
                    <div className="section-header reports-title">
                        <h1><strong>Reports</strong> <i className="oval"></i> {this.state.reportTitle} <span>{this.state.count}</span></h1>
                    </div>
                    <ReactTable data={this.state.data}
                                columns={this.state.columns}
                                getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                                defaultPageSize={50}
                                showPagination={true}
                                showPageSizeOptions={false}
                                loading={this.state.loading}
                                className="ReportsTable"
                                />

                    <Dialog
                        actions={this.state.modelActions}
                        modal={false}
                        open={this.state.openModal}
                        onRequestClose={this.handleModelClose}
                        contentClassName={'report-dialog'}
                        actionsContainerClassName="col-md-12 report-modal-action"
                    >
                        <div className="title">{this.state.modelTitle}</div>
                        <div className="address">{this.state.address}</div>

                      {this.state.openedModal == 'AddOpenHomeModel' &&
                      <div>
                        <div className="form-group row element single-input">
                            <label className='form-label col-xs-6 lbldate'>Time</label>
                            <div className="model-input timepicker col-xs-6">
                                <img src={clockIcon} className="clock-icon" />
                                <TimePicker
                                    className='col-xs-12 text-feild'
                                    hintText="10.00 AM"
                                    value={this.state.selectedTime}
                                    onChange={this.onTimeChange}
                                    autoOk={true}
                                    inputStyle={timePickerInputStyles}
                                />
                            </div>
                        </div>
                        <div className="form-group row element single-input">
                            <label className='form-label col-xs-6 lbldate'>Date</label>
                            <div className="datepicker col-xs-6">
                                <DatePicker
                                    className='col-xs-6 model-input'
                                    onChangeDate={this.onDateChange}
                                    disabled={false}
                                    value={this.state.selectedDate}
                                    inputStyle={{marginLeft:"-9px"}}
                                    inputS
                                />
                            </div>
                        </div>
                        <div className="form-group row element single-input">
                            <label className='form-label col-xs-6 lbldate'>Duration</label>
                                <select className='col-xs-6 model-input' value={this.state.selectedDuration} onChange={this.onDurationChange} required>
                                  {
                                    this.state.duration_list.map(function(duration) {
                                      return <option key={duration.id}
                                        value={duration.value}>{duration.value} Minutes</option>;
                                    })
                                  }
                                </select>
                        </div>
                        <div className="form-group row element single-input">
                            <label className='form-label col-xs-6 lbldate'>Shown By</label>
                                <select className='col-xs-6 model-input' value={this.state.selectedShownBy} onChange={this.onShownByChange} required>
                                  {
                                    this.state.shown_by_list.map(function(user) {
                                      return <option key={user.id}
                                        value={user.id}>{user.name}</option>;
                                    })
                                  }
                                </select>
                        </div>
                      </div>
                      }

                      {this.state.openedModal == 'AccessNoteModel' &&
                        <div className="form-group row element single-input">
                        {!this.state.isEditing ?
                          <div className="access_preview col-md-12">
                            {this.state.note ? <pre className="access_preview__text col-md-12"> {this.state.note} </pre>: <p className="access_preview__text col-md-12"></p> }
                          </div> : <textarea type="text" value={this.state.note} onChange={this.handleChangeNote} className="access_preview access_preview__text_editable col-md-12" placeholder="Add access note here..." rows="8"/>}

                        {this.state.isEditing ? <div className="col-md-12 note-action">
                            <button className="button bill-button" onClick={this.handleClickCancel}>Cancel</button>
                            <button className="button button_main bill-button" onClick={this.handleNoteSave}>Save</button>
                        </div>
                            : <div className="col-md-12 note-action">
                                <button className="button bill-button" onClick={this.handleModelClose}>Cancel</button>
                                <button className="button button_main bill-button" onClick={this.handleClickEdit}>{this.state.note ? 'Edit' : 'Add' }</button>
                            </div>}
                        </div>
                      }
                    </Dialog>

                    <Dialog
                        modal={false}
                        open={this.state.openMap}
                        onRequestClose={this.handleMapClose}
                        contentClassName={'report-map-dialog'}
                        bodyClassName={'dialog-content'}
                    >
                      <div>
                        <GoogleMapReact
                        bootstrapURLKeys={{ key: MAP_API_KEY }}
                        center={this.state.center}
                        zoom={this.state.zoom}
                        onBoundsChange={this.handleBoundsChange}
                        options = {{ minZoom: 4, maxZoom: 20 }}
                        style={mapContainerStyles}
                        >
                        {
                          this.state.data.map(function(property, index) {
                            if (property.location && property.location != '-' ) {
                              return <MapPoint
                                key={index}
                                lat={property.location.lat}
                                lng={property.location.lon}
                                property={property}
                                index={index}
                                />;
                            }
                          })
                        }
                        </GoogleMapReact>
                        <div className="map_left">
                          <div className="address_list_top">
                            <a className="close-map" onClick={this.handleMapClose}><img src={closeIcon} /></a>
                          </div>
                          <div className="address_list">
                          {
                            this.state.data.map(function(property, index) {
                              if (property.location && property.location != '-' ) {
                                return <p className="map_item" key={index} onClick={() => {Renewals.handleSelectMapProperty(index, property)}}>
                                      <span className="map_pin">
                                        <span className="map_pin_value">{index+1}</span>
                                      </span>
                                      <span className="address">{property.address}</span>
                                    </p>;
                              }
                            })
                          }
                          </div>
                          <div className="address_list_bottom">
                            <button className="button bill-button" onClick={this.handleMapClose}>Exit</button>
                          </div>
                        </div>
                      </div>
                    </Dialog>
                </div>
            </div>
        );
    }
}
