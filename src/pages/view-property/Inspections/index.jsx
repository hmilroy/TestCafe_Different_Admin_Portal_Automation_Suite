import React from 'react';
import ReactTable from 'react-table';
import Moment from 'moment';
import _ from 'underscore';
import Toastr from 'toastr';
import DropZone from 'react-dropzone';
import ReactTooltip from 'react-tooltip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropertiesServices from '../../../services/PropertiesServices.js';
import SearchService from '../../../services/SearchServices.js';
import InspectionService from '../../../services/InspectionService.js';
import BlockingActions from '../../../actions/BlockingActions.js';
import OptimalHash from '../../../utility/optimus.js';
import DateInput from '../../../components/elements/DateInput.jsx';
import SingleInput from '../../../components/elements/SingleInput.jsx';
import SearchInput from '../../../components/elements/SearchInput.jsx';
import Select from '../../../components/elements/Select.jsx';
import Modal from 'react-responsive-modal';
import GoogleDocumentViewer from '../../../components/GoogleDocViewer/index.js';
import uploadIcon from '../../../assets/images/upload.svg';
import installIcon from '../../../assets/images/install.png';
import deleteIcon from '../../../assets/images/delete.png';
import replaceIcon from '../../../assets/images/replace.png';
import DownloadJs from 'downloadjs';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import DatePicker from '../../../components/elements/DatePicker';


const INSPECTION_TYPES = [
    {
        id: 1,
        name: 'Entry condition report'
    },
    {
        id: 2,
        name: 'Routine inspection'
    },
    {
        id: 3,
        name: 'Exit condition report'
    }];

export default class Inspections extends React.Component {
    constructor(props) {
        super(props);

        let propertyId = OptimalHash.decode(props.params.id);
        this.state = {
            address: '',
            openAdd: false,
            inspection_types: INSPECTION_TYPES,
            selected_inspect_type: '',
            uploadFile: {},
            inspector_id: '',
            inspection_date: '',
            inspection_date_input: null,
            inspectors: [],
            inspectorsObject: [],
            displayInspectorsObject: [],
            inspectorInput: '',
            type_id: 1,
            property_id: propertyId,
            data: null,
            tableData: [],
            openDelete: false,
            replace: false,
            inspection_id: '',
            inspectorName: '',
            is_valid_inspector: true,
            is_valid_inspection_date: true,
            inspection_date_message: '',
            documentLink: '',
            modalOpen: false,
            downloadInProgress: {},
            pages: -1,
            page:0
        };

        this.handleAddOpen = this.handleAddOpen.bind(this);
        this.handleAddClose = this.handleAddClose.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.onDropFiles = this.onDropFiles.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleInspectionTypeSelect = this.handleInspectionTypeSelect.bind(this);
        this.onUpdateInspectorInput = this.onUpdateInspectorInput.bind(this);
        this.onNewInspectorRequest = this.onNewInspectorRequest.bind(this);
        this.handleDelOpen = this.handleDelOpen.bind(this);
        this.handleDelClose = this.handleDelClose.bind(this);
        this.handleRepOpen = this.handleRepOpen.bind(this);
        this.handleRepClose = this.handleRepClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getInspectorById = this.getInspectorById.bind(this);
        this.resetState = this.resetState.bind(this);
        this.searchInspectors = this.searchInspectors.bind(this);
        this.clearFormData = this.clearFormData.bind(this);
        this.getValidation = this.getValidation.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.previewDocument = this.previewDocument.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.changeDownloadingState = this.changeDownloadingState.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this._mount = false;
    }

    changeDownloadingState(label, value) {
        let downloadInProgress = _.clone(this.state.downloadInProgress);
        downloadInProgress[label] = value;

        this.setState({downloadInProgress});
    }

    downloadFile(rowInfo) {
        let downloadRowLabel = 'row_' + rowInfo.row.file.id;
        this.changeDownloadingState(downloadRowLabel, true);
        const file = rowInfo.row.file.public_url;
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
        this._mount = true;
        this.fetchData();
    }

    componentWillUnmount() {
        this._mount = false;
    }

    onModalClose() {
        this.setState({
            documentLink: '',
            modalOpen: false
        });
    }

    openModal() {
        this.setState({
            modalOpen: true
        });
    }

    handleDelOpen() {
        this.setState({openDelete: true});
    }

    handleDelClose() {
        this.setState({openDelete: false});
    }

    clearFormData() {
        this.setState({
            inspection_date_input: '',
            inspectorInput: '',
            inspector_id: null,
            uploadFile: {},
            is_valid_inspector: true,
            is_valid_inspection_date: true,
            inspection_date_message: ''
        });
    }

    resetState() {
        this.setState({
            openAdd: false,
            selected_inspect_type: '',
            uploadFile: {},
            inspector_id: '',
            inspection_date: '',
            inspection_date_input: null,
            inspectorInput: '',
            type_id: 1,
            openDelete: false,
            replace: false,
            inspection_id: '',
            inspectorName: '',
            inspectors: [],
            inspectorsObject: []
        });
    }

    handleRepOpen(state, rowInfo, column) {
        let inspection = _.findWhere(this.state.data, {id: this.state.inspection_id});
        let date = new Date(inspection.inspected_at);
        this.setState({
            openAdd: true,
            replace: true,
            inspection_date_input: date,
            inspectorName: rowInfo.rowValues.inspector
        });
    }

    handleRepClose() {
        this.setState({
            openAdd: false
        });
    }

    getInspectorById(id) {
        return this.state.inspectorsObject.filter((item) => {
            return item.id === id;
        }).map(item => {
            return item.name;
        })[0];
    }

    previewDocument(href) {
        this.setState({
            documentLink: href
        });
        this.openModal();
    }

    fetchData() {
        let self = this;
        let propertyId = OptimalHash.decode(this.props.params.id);
        PropertiesServices.viewProperty(propertyId)
            .then(function (value) {
                if (self._mount) {
                    self.setState({
                        address: value.status.data.addr_street_address
                    });
                }
            });

        InspectionService.getInspectors()
            .then(function (value) {
                if (self._mount) {
                    self.setState({
                        displayInspectorsObject: value.data
                    });
                }
            });

        InspectionService.getInspections(propertyId)
            .then(function (value) {
                if (value && self._mount) {
                    let count = value.data ? value.data.inspectionReports.length : 0;
                    let pages = Math.ceil(count / 25);
                    self.setState({
                        data: value.data ? value.data.inspectionReports : null,
                        pages:pages
                    });
                    let tableData = [];
                    value.data.inspectionReports.map((obj) => {
                        tableData.push({
                            type: _.findWhere(INSPECTION_TYPES, {id: obj.inspection_type}).name,
                            inspect_date: Moment(obj.inspected_at).format("YYYY-MM-DD"),
                            inspector: obj.user_name,
                            file: obj
                        });
                    });
                    self.setState({
                        tableData: tableData
                    });
                }
            });
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                this.setState({
                    inspection_id: rowInfo.row.file.id,
                    uploadFile: {}
                }, function () {
                    if (column.name == 'info') {
                        this.previewDocument(rowInfo.row.file.public_url);
                    }
                    if (column.id === 'delete') {
                        this.handleDelOpen();
                    } else if (column.id == 'file'){
                        this.downloadFile(rowInfo);
                    } else if (column.id === 'replace') {
                        this.handleRepOpen(state, rowInfo, column);
                    }
                });
            }
        }
    }

    handleAddOpen() {
        this.setState({
            openAdd: true,
            replace: false
        });
    }

    handleAddClose() {
        this.setState({
            openAdd: false
        });
        this.clearFormData();
    }

    getValidation() {
        let isValid = true;
        // inspector validation
        if (!this.state.inspector_id) {
            this.setState({
                is_valid_inspector: false
            });
            isValid = false;
        }

        // inspection date validation
        let dateValidationMessage = '';
        if (this.state.inspection_date === '') {
            dateValidationMessage = 'Please select an inspection date';
        } else if (new Date(this.state.inspection_date) > new Date()) {
            dateValidationMessage = 'Inspection date cannot be a future date';
            isValid = false;
        }
        if (dateValidationMessage) {
            this.setState({
                is_valid_inspection_date: false,
                inspection_date_message: dateValidationMessage
            });
            isValid = false;
        }
        return isValid;
    }

    handleUploadFile() {
        if (this.state.uploadFile) {
            BlockingActions.block();
            let documentInput = null;
            if (this.state.replace) {
                documentInput = {
                    inspection_report_id: this.state.inspection_id,
                    file: this.state.uploadFile
                };
            } else {
                documentInput = {
                    property_id: this.state.property_id,
                    user_id: this.state.inspector_id,
                    inspection_type: this.state.type_id,
                    inspected_at: this.state.inspection_date,
                    file: this.state.uploadFile
                };
            }
            let method = this.state.replace ? 'PUT' : 'POST';


            // Validation
            if (!this.state.replace) {
                let isValid = this.getValidation();
                if(!isValid) {
                    BlockingActions.unblock();
                    return;
                }
            }

            InspectionService.addDocument(documentInput, method)
                .then(response => {
                    Toastr.success(response.status.message);
                    this.handleAddClose();
                    this.resetState();
                    this.fetchData();
                    this.clearFormData();
                    BlockingActions.unblock();
                })
                .catch(response => {
                    Toastr.error(response.status.message);
                    this.handleAddClose();
                    this.resetState();
                    BlockingActions.unblock();
                });
        }
    }

    onDropFiles(file) {
        this.setState({
            uploadFile: file[0]
        });
    }

    test() {

    }

    handleInspectionTypeSelect(e) {
        let type = e.target.value;
        this.setState({
            selected_inspect_type: type,
            type_id: _.findWhere(INSPECTION_TYPES, {name: type}).id
        });
        let self = this;
        setTimeout(function () {
        }, 1000);
    }

    handleDateChange(e, date) {
        this.setState({
            inspection_date: date,
            inspection_date_input: e._d,
            is_valid_inspection_date: true,
            inspection_date_message: ''
        });
    }

    onUpdateInspectorInput(inputValue) {
        this.setState({
            inspectorInput: inputValue,
            inspector_id: null,
            is_valid_inspector: true
        });
        this.searchInspectors(inputValue);
    }

    searchInspectors(inputValue) {
        if(this.state.inspectorInput !== '') {
            SearchService.searchUser(inputValue)
                .then( value=> {
                    let inspectorsObject = value;
                    let inspectors = inspectorsObject.map(user=> {
                        return user.name;
                    });
                    this.setState({
                        inspectorsObject: inspectorsObject,
                        inspectors: inspectors
                    });
                });
        }
    }

    handleDelete() {
        if (this.state.inspection_id) {
            BlockingActions.block();
            InspectionService.deleteInspection(this.state.inspection_id)
                .then(response => {
                    this.fetchData();
                    Toastr.success(response.status.message);
                    this.handleDelClose();
                    BlockingActions.unblock();
                })
                .catch(response => {
                    Toastr.error(response.status.message || 'An error occurred while deleting!');
                    this.handleDelClose();
                    BlockingActions.unblock();
                });
        }
    }

    onNewInspectorRequest(value) {
        let selected = _.findWhere(this.state.inspectorsObject, {name: value});
        if (!_.isUndefined(selected.user_id) && !_.isNull(selected.user_id)) {
            this.setState({
                inspector_id: selected.user_id
            });
        }
    }

    handlePageChange({selected}){
        this.setState({page:selected});
    }

    render() {
        const columns = [{
            name: 'info',
            header: 'Type',
            accessor: 'type',
            headerClassName: 'document-custom-header'
        }, {
            name: 'info',
            header: 'Date Inspected',
            accessor: 'inspect_date',
            headerClassName: 'document-custom-document-header'
        }, {
            name: 'info',
            header: 'Inspector',
            accessor: 'inspector',
            headerClassName: 'document-custom-created-at-header'
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'file',
            accessor: (d) => {
                let anchorClassName = 'download-icon';
                if (!_.isUndefined(d.file.id)) {
                    let id = 'row_' + d.file.id;
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
            className: 'icon-center',
            sortable: false
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'delete',
            accessor: d => (
                <div><img data-tip="Delete" src={deleteIcon}/></div>
            ),
            maxWidth: 50,
            className: 'icon-center',
            sortable: false
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'replace',
            accessor: d => (
                <div><img data-tip="Update" src={replaceIcon}/></div>
            ),
            maxWidth: 50,
            className: 'icon-center',
            sortable: false
        }];


        const actions = [
            <button className="button button_main bill-button" onClick={this.handleUploadFile}>SAVE</button>,
            <button className="button bill-button" onClick={this.handleAddClose}>CANCEL</button>
        ];

        const deleteActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleDelClose}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this.handleDelete}
            />,
        ];

        let actionTitle = this.state.replace ? 'Replace' : 'Add';
        const modalStyles = {
            'modal': {
                maxWidth: 'none'
            }
        };

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

        let {page, tableData} = this.state;
        tableData = _.first( _.rest(tableData, page), 25);


        return (
            <div className="admin-padding-adjustment maintenance-dashboard-property maintenance-dashboard-property--inspection">
                <Modal styles={modalStyles} open={this.state.modalOpen} onClose={this.onModalClose}>
                    {this.state.documentLink && <GoogleDocumentViewer url={this.state.documentLink}/>}
                </Modal>
                <div className="section-header">
                    <h1>{this.state.address} <i className="oval"/> <span className="document">Inspections</span></h1>
                </div>
                <ReactTable
                    data={tableData}
                    columns={columns}
                    getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                    minRows={3}
                />
                <div className="DA-PaginationContainer">
                    <ReactPaginate
                        {...paginateProps}
                        pageCount={this.state.pages}
                        pageRangeDisplayed={2}
                        breakLabel={breakLabel}
                        onPageChange={this.handlePageChange}/>
                </div>
                <form className="add-maintenance button-section">
                    <button className="button save-button" type="button" value="Add Inspection"
                            onTouchTap={this.handleAddOpen}>
                        Add Inspection
                    </button>
                </form>
        
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.openAdd}
                    onRequestClose={this.handleAddClose}
                    contentClassName={'inspection-dialog'}
                    actionsContainerClassName="inspector-add-modal-action"
                >
                <div className="title">{actionTitle} inspection to</div>
                <div className="address">{this.state.address}</div>
                    <Select
                        title={'Type'}
                        name={'type'}
                        selectedOption={this.state.selected_inspect_type}
                        controlFunc={this.handleInspectionTypeSelect}
                        options={this.state.inspection_types}
                        disabled={this.state.replace}
                    />
                    <div className="form-group row element single-input">
                        <label className='form-label col-xs-4 lbldate'>Date inspected</label>
                            <DatePicker 
                                onChangeDate={this.handleDateChange}
                                disabled={this.state.replace}
                                value={this.state.inspection_date_input}
                                inputStyle={{width:"304px", marginLeft:"-11px"}}
                                inputS
                            />
                    </div>
                    {!this.state.is_valid_inspection_date &&
                        <p className="hint-error col-xs-offset-4">{this.state.inspection_date_message}</p>}
                    {this.state.replace ?
                        <SingleInput
                            title={'Inspector'}
                            name={'inspector'}
                            inputType={'text'}
                            disabled={true}
                            content={this.state.inspectorName || ' '}
                            controlFunc={this.test}
                        />
                        :
                        <SearchInput
                            inputClass="inspection"
                            floatingLabelText={'Search Inspectors'}
                            title="Inspector"
                            dataSource={this.state.inspectors}
                            onUpdateInput={this.onUpdateInspectorInput}
                            onNewRequest={this.onNewInspectorRequest}
                            disabled={this.state.replace}
                            inputValue={this.state.inspectorInput}/>
                    }
                    {!this.state.is_valid_inspector &&
                    <p className="hint-error col-xs-offset-4">Please select an inspector from suggestions</p>}
                    <br/>
                    <DropZone onDrop={this.onDropFiles} className="col-xs-12 drop-zone-content">
                        <div className="upload-icon"><img src={uploadIcon}/></div>Drag & drop, or browse.
                    </DropZone>
                    {this.state.uploadFile.name && (
                        <ul>
                            <li>{this.state.uploadFile.name}</li>
                        </ul>
                    )}
                </Dialog>
                <Dialog
                    actions={deleteActions}
                    modal={false}
                    open={this.state.openDelete}
                    onRequestClose={this.handleDelClose}
                >
                    Delete Inspection?
                </Dialog>
            </div>
        );
    }
}
