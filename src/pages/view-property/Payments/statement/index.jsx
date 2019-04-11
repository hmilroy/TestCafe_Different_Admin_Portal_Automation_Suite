import React from 'react';
import ReactTable from 'react-table';
import Toastr from 'toastr';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropZone from 'react-dropzone';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import _ from 'underscore';

import DocumentService from '../../../../services/DocumentService.js';
import PropertyService from '../../../../services/PropertiesServices.js';
import PropertyStore from '../../../../stores/PropertyStore';
import StatementType from '../../../../../data/statementtypes.json';
import Months from '../../../../../data/month.json';
import Select from '../../../../components/elements/Select.jsx';
import YearSelect from '../../../../components/elements/yearselect.jsx';
import BlockingActions from '../../../../actions/BlockingActions.js';

import installIcon from '../../../../assets/images/install.png';
import replaceIcon from '../../../../assets/images/replace.png';
import Modal from 'react-responsive-modal';
import GoogleDocumentViewer from '../../../../components/GoogleDocViewer/index.js';
import DownloadJs from 'downloadjs';
import axios from 'axios';

import 'react-table/react-table.css';
import './statement.scss';

export default class Statement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            data: [],
            address: '',
            loading: true,
            openAdd: false,
            uploadFile: {},
            replace: false,
            statement_id: '',
            year: moment().year(),
            month: moment().format('MMMM'),
            type: 'Monthly',
            documentLink: '',
            modalOpen: false,
            downloadInProgress: {}
        };

        this.handleAddOpen = this.handleAddOpen.bind(this);
        this.handleRepOpen = this.handleRepOpen.bind(this);
        this.handleAddClose = this.handleAddClose.bind(this);
        this.handleRepClose = this.handleRepClose.bind(this);
        this.onDropFiles = this.onDropFiles.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleTypeSelect = this.handleTypeSelect.bind(this);
        this.handleTableClick = this.handleTableClick.bind(this);
        this.handleMonthSelect = this.handleMonthSelect.bind(this);
        this.handleYearSelect = this.handleYearSelect.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.previewDocument = this.previewDocument.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.resetToCurrentMonth = this.resetToCurrentMonth.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.changeDownloadingState = this.changeDownloadingState.bind(this);
    }

    changeDownloadingState(label, value) {
        let downloadInProgress = _.clone(this.state.downloadInProgress);
        downloadInProgress[label] = value;
        this.setState({downloadInProgress});
    }

    downloadFile(rowInfo) {
        let downloadRowLabel = 'row_' + rowInfo.row.id;
        this.changeDownloadingState(downloadRowLabel, true);
        const file = rowInfo.row.public_url;
        let fileName = 'file';
        let nameArray = file.split('?');
        fileName = nameArray[0];
        nameArray = fileName.split('/');
        fileName = nameArray[nameArray.length - 1];

        let fileUrl = axios.get(file, {
            responseType: 'blob'
        });
        fileUrl
            .then((res)=> {
                DownloadJs(res.data, fileName, 'blob');
                this.changeDownloadingState(downloadRowLabel, false);
            })
            .catch((err) => {
                this.changeDownloadingState(downloadRowLabel, false);
                Toastr.error('Download failed, please try again');
            })
    }

    componentDidMount() {
        this.fetchData();
    }

    previewDocument(href) {
        this.setState({
            documentLink: href
        });
        this.openModal();
    }

    onModalClose() {
        this.setState({
            documentLink: '',
            modalOpen: false
        });
        this.resetToCurrentMonth()
    }

    openModal() {
        this.setState({
            modalOpen: true
        });
    }

    fetchData() {
        let self = this;
        DocumentService.getStatements(PropertyStore.propertyId)
            .then(function (value) {
                let data = [];
                value.data.statements.map((statement) => {
                    data.push({
                        id: statement.id,
                        type: statement.month ? 'Monthly' : 'Annual',
                        year: statement.year,
                        month: statement.month ? moment(statement.month, 'MM').format('MMMM') : '-',
                        public_url: statement.public_url
                    })
                });
                self.setState({
                    loading: false,
                    data: data,
                    count: data.length
                })
            });

        PropertyService.viewProperty(PropertyStore.propertyId)
            .then(value => {
                let address = value.status.data.addr_street_address
                    .substring(0, value.status.data.addr_street_address
                        .indexOf(', ' + value.status.data.addr_suburb));
                this.setState({
                    address: address
                });
            })
    }

    onDropFiles(file) {
        this.setState({
            uploadFile: file[0]
        })
    }

    handleAddOpen() {
        this.setState({
            openAdd: true,
            replace: false
        });
    }

    handleAddClose() {
        this.setState({
            openAdd: false,
            uploadFile: {}
        });
        this.resetToCurrentMonth()
    }

    handleRepOpen() {
        this.setState({
            openAdd: true,
            replace: true
        });
    }

    handleRepClose() {
        this.setState({
            openAdd: false,
            uploadFile: {}
        });
        this.resetToCurrentMonth()
    }

    resetToCurrentMonth() {
        this.setState({
            month: moment().format('MMMM')
        });
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                this.setState({
                    statement_id: rowInfo.row.id,
                    type: rowInfo.row.type,
                    month: rowInfo.row.month === '-' ? null : rowInfo.row.month,
                    year: rowInfo.row.year,
                    uploadFile: {}
                }, function () {
                    if (column.name == 'info') {
                        this.previewDocument(rowInfo.row.public_url);
                    } else if (column.id == 'file'){
                        this.downloadFile(rowInfo);
                    }
                    if (column.id == 'replace') {
                        this.handleRepOpen();
                    }
                });
            }
        }
    }

    handleTypeSelect(e) {
        let month = 'January';
        if(e.target.value === 'Annual') {
            month = '-';
        }

        this.setState({
            type: e.target.value,
            month: month
        });
    }

    handleMonthSelect(e) {
        this.setState({
            month: e.target.value
        });
    }

    handleYearSelect(e) {
        this.setState({
            year: e.target.value
        });
    }

    handleUploadFile() {
        if (this.state.uploadFile) {
            BlockingActions.block();
            // To identify add or replace
            let method = this.state.replace ? 'PUT' : 'POST';

            let data = {};
            data.file = this.state.uploadFile;
            if(this.state.replace) {
                data.statement_id = this.state.statement_id;
            } else {
                data.year = this.state.year;
                data.statement_type = this.state.type === 'Monthly' ? 1 : 2;
                data.property_id = PropertyStore.propertyId;
                if(this.state.type === 'Monthly') {
                    data.month = _.where(Months, {'name': this.state.month})[0].id;
                }
            }
            DocumentService.addStatement(data, method)
                .then(response => {
                    this.fetchData();
                    Toastr.success(response.status.message);
                    this.handleAddClose();
                    this.setState({
                        file: {}
                    });
                    BlockingActions.unblock();
                })
                .catch(response => {
                    Toastr.error(response.status.message);
                    this.handleAddClose();
                    BlockingActions.unblock();
                });
        }
    }

    render() {
        const columns = [{
            name: 'info',
            header: 'Type',
            accessor: 'type',
            headerClassName: 'document-custom-header'
        }, {
            name: 'info',
            header: 'Year',
            accessor: 'year',
            headerClassName: 'document-custom-document-header'
        }, {
            name: 'info',
            header: 'Month',
            accessor: 'month',
            headerClassName: 'document-custom-created-at-header'
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'file',
            accessor: (d) => {
                let anchorClassName = 'download-icon';
                if (!_.isUndefined(d.id)) {
                    let id = 'row_' + d.id;
                    if (!_.isUndefined(this.state.downloadInProgress[id]) && this.state.downloadInProgress[id] === true) {
                        anchorClassName = 'download-icon download-icon--downloading'
                    }
                }
                return (
                    <a className={anchorClassName}><img
                        data-tip="Download" src={installIcon}/>
                        <ReactTooltip  place="top" type="dark" effect="solid"/></a>
                );
            },
            maxWidth: 50,
            sortable: false
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'replace',
            accessor: d => (
                <div><img data-tip="Replace" src={replaceIcon}/></div>
            ),
            maxWidth: 50,
            sortable: false
        }];

        const actions = [
            <FlatButton
                label="ADD"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleUploadFile}
            />,
            <FlatButton
                label="CANCEL"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleAddClose}
            />,
        ];

        let actionTitle = this.state.replace ? 'Replace' : 'Add';
        const modalStyles = {
            'modal': {
                maxWidth: 'none'
            }
        }
        return (
            <div className="statement-section">
                <Modal styles={modalStyles} open={this.state.modalOpen} onClose={this.onModalClose}>
                    {this.state.documentLink && <GoogleDocumentViewer url={this.state.documentLink}/>}
                </Modal>
                <ReactTable data={this.state.data}
                            columns={columns}
                            getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                            pageSize={this.state.count}
                            showPagination={false}
                            loading={this.state.loading}/>
                <div className="bottom-buttons force-left">
                    <button className="button save-button" type="button" value="Add Document"
                            onTouchTap={this.handleAddOpen}>
                        Add Statement
                    </button>
                </div>
                <Dialog className="add-person-form"
                        actions={actions}
                        modal={false}
                        open={this.state.openAdd}
                        onRequestClose={this.handleAddClose}>
                    {actionTitle} document to
                    <h1>{this.state.address}</h1>
                    <div>
                        <Select
                            title={'Type'}
                            name={'type'}
                            controlFunc={this.handleTypeSelect}
                            options={StatementType}
                            selectedOption={this.state.type}
                            disabled={this.state.replace}/>
                        <YearSelect
                            title={'Year'}
                            name={'year'}
                            controlFunc={this.handleYearSelect}
                            selectedOption={this.state.year}
                            disabled={this.state.replace}/>
                        <Select
                            title={'Month'}
                            name={'month'}
                            controlFunc={this.handleMonthSelect}
                            options={Months}
                            selectedOption={this.state.month}
                            disabled={this.state.replace || this.state.type === 'Annual'}/>
                        <DropZone onDrop={this.onDropFiles} className="col-xs-12 drop-zone-content">
                            <a>Drag & drop, or browse.</a>
                        </DropZone>
                        {this.state.uploadFile.name && (
                            <ul>
                                <li>{this.state.uploadFile.name}</li>
                            </ul>
                        )}
                    </div>
                </Dialog>
            </div>
        );
    }
}
