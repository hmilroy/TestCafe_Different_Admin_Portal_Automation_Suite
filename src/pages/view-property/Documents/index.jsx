import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import _ from 'underscore';
import Toastr from 'toastr';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropZone from 'react-dropzone';
import ReactTooltip from 'react-tooltip'
import PropertiesServices from '../../../services/PropertiesServices.js';
import DocumentService from '../../../services/DocumentService.js';
import PropertyStore from '../../../stores/PropertyStore';
import BlockingActions from '../../../actions/BlockingActions.js';
import SelectCategory from '../../../components/elements/DocumentCategorySelect.jsx';
import SelectDocument from '../../../components/elements/DocumentSelect.jsx';
import GoogleDocumentViewer from '../../../components/GoogleDocViewer/index.js';
import installIcon from '../../../assets/images/install.png';
import deleteIcon from '../../../assets/images/delete.png';
import replaceIcon from '../../../assets/images/replace.png';
import uploadIcon from '../../../assets/images/upload.svg';
import Modal from 'react-responsive-modal';
import OptimalHash from '../../../utility/optimus.js';
import DownloadJs from 'downloadjs';
import axios from 'axios';
import 'react-table/react-table.css';
import './documents.scss';

export default class Document extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            data: [],
            categories: [],
            documents: [],
            loading: true,
            address: '',
            file: '',
            openAdd: false,
            openDelete: false,
            categoryDisabled: true,
            category_id: 2,
            document_id: 0,
            uploadFile: {},
            documentLink: '',
            documentLinkEncoded: '',
            modalOpen: false,
            downloadInProgress: {}
        };

        this.handleAddOpen = this.handleAddOpen.bind(this);
        this.handleDelOpen = this.handleDelOpen.bind(this);
        this.handleRepOpen = this.handleRepOpen.bind(this);
        this.handleAddClose = this.handleAddClose.bind(this);
        this.handleDelClose = this.handleDelClose.bind(this);
        this.handleRepClose = this.handleRepClose.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleDocumentSelect = this.handleDocumentSelect.bind(this);
        this.onDropFiles = this.onDropFiles.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.openModal = this.openModal.bind(this);
        this.previewDocument = this.previewDocument.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.changeDownloadingState = this.changeDownloadingState.bind(this);
    }

    changeDownloadingState(label, value) {
        let downloadInProgress = _.clone(this.state.downloadInProgress);
        downloadInProgress[label] = value;
        this.setState({downloadInProgress});
    }

    downloadFile(rowInfo) {
        let downloadRowLabel = 'row_' + rowInfo.row.document_id;
        this.changeDownloadingState(downloadRowLabel, true);
        const file = rowInfo.row.file.downloadUrl;
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

    onModalClose() {
        this.setState({
            documentLink: '',
            documentLinkEncoded: '',
            modalOpen: false
        });
    }

    openModal() {
        this.setState({
            modalOpen: true
        });
    }

    fetchData() {
        let self = this;
        let propertyId = OptimalHash.decode(self.props.params.id);
        PropertiesServices.viewProperty(propertyId)
            .then(function (value) {
                self.setState({
                    address: value.status.data.addr_street_address
                });
            });
        DocumentService.getDocuments(propertyId)
            .then(function (value) {
                let data = [];

                value.data.map(object => {
                    data.push({
                        category: object.category.name,
                        document: object.document.name,
                        category_id: object.category.id,
                        document_id: object.document.id,
                        id: object.documentCategoriesId,
                        created_at: moment(object.uploadedDate).format('DD/MM/YYYY'),
                        file: object
                    })
                });
                self.setState({
                    loading: false,
                    data: data,
                    count: data.length
                })
            });
        DocumentService.getAllCategory()
            .then(value => {
                self.setState({
                    categories: value.data,
                    documents: _.where(value.data, {id: self.state.category_id})[0].Documents,
                    document_id: _.where(value.data, {id: self.state.category_id})[0].Documents[0].DocumentCategoryId
                })
            });
    }

    handleCategorySelect(e) {
        this.setState({
            category_id: parseFloat(e.target.value),
            documents: _.where(this.state.categories, {id: parseFloat(e.target.value)})[0].Documents,
            document_id: _.where(this.state.categories, {id: parseFloat(e.target.value)})[0].Documents[0].DocumentCategoryId
        })
    }

    onDropFiles(file) {
        this.setState({
            uploadFile: file[0]
        })
    }

    handleDocumentSelect(e) {
        this.setState({
            document_id: parseFloat(e.target.value),
        })
    }

    handleAddOpen() {
        this.setState({
            openAdd: true,
            categoryDisabled: false
        });
    }

    handleAddClose() {
        this.setState({
            openAdd: false,
            categoryDisabled: true,
            uploadFile: {}
        });
    }

    handleDelOpen() {
        this.setState({openDelete: true});
    }

    handleDelClose() {
        this.setState({openDelete: false});
    }

    handleRepOpen() {
        this.setState({
            openAdd: true,
            categoryDisabled: true
        });
    }

    handleRepClose() {
        this.setState({
            openAdd: false,
            uploadFile: {}
        });
    }

    handleTableClick(state, rowInfo, column) {
        return {
            onClick: e => {
                this.setState({
                    category_id: rowInfo.row.category_id,
                    documents: _.where(this.state.categories, {id: rowInfo.row.category_id})[0].Documents,
                    document_id: rowInfo.row.id,
                    uploadFile: {}
                }, function () {
                    if (column.name == 'info') {
                        // this.previewDocument(rowInfo.rowValues.file.props['data-fileurl']);
                        this.previewDocument(rowInfo.row.file.downloadUrl);
                    }
                    if(column.id == 'delete') {
                        this.handleDelOpen();
                    } else if (column.id == 'file'){
                        this.downloadFile(rowInfo);
                    } if (column.id == 'replace') {
                        this.handleRepOpen();
                    }
                });
            }
        }
    }

    previewDocument (href) {
        this.setState({
            documentLink: href,
            documentLinkEncoded: encodeURIComponent(href)
        });
        this.openModal();
    }

    handleDelete() {
        if(this.state.document_id) {
            BlockingActions.block();
            DocumentService.deleteDocuments(PropertyStore.propertyId, this.state.document_id)
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

    handleUploadFile() {
        if (this.state.uploadFile) {
            BlockingActions.block();
            // To identify add or replace
            let method = this.state.categoryDisabled ? 'PUT' : 'POST';
            DocumentService.addDocument({
                category_id: this.state.document_id,
                property_id: PropertyStore.propertyId,
                file: this.state.uploadFile
            }, method)
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
            header: 'Category',
            accessor: 'category',
            headerClassName: 'document-custom-header'
        }, {
            name: 'info',
            header: 'Document',
            accessor: 'document',
            headerClassName: 'document-custom-document-header'
        }, {
            name: 'info',
            header: 'Date Created',
            accessor: 'created_at',
            rowData: 'react-table',
            headerClassName: 'document-custom-created-at-header'
        }, {
            header: () => <span className="different-table-header-blank"/>,
            id: 'file',
            accessor: (d) => {
                let anchorClassName = 'download-icon';
                if (!_.isUndefined(d.document_id)) {
                    let id = 'row_' + d.document_id;
                    if (!_.isUndefined(this.state.downloadInProgress[id]) && this.state.downloadInProgress[id] === true) {
                        anchorClassName = 'download-icon download-icon--downloading'
                    }
                }

                return (
                <a className={anchorClassName}><img
                    data-tip="Download" src={installIcon}/>
                    <ReactTooltip  place="top" type="dark" effect="solid"/></a>
            )},
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
            <button className="button button_main bill-button" onClick={this.handleUploadFile}>ADD</button>,
            <button className="button bill-button" onClick={this.handleAddClose}>CANCEL</button>
        ];
        const deleteActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleDelClose}
            />,
            <FlatButton
                label="Discard"
                primary={true}
                onClick={this.handleDelete}
            />,
        ];

        let actionTitle = this.state.categoryDisabled ? 'Replace' : 'Add';
        const modalStyles = {
            'modal': {
                maxWidth: 'none'
            }
        };
        let docViewerSrc = '';
        if (this.state.documentLinkEncoded !== '') {
            docViewerSrc = 'https://docs.google.com/viewer?url=' + this.state.documentLinkEncoded + '&rm=minimal&embedded=true';
        }
        return (
            <div className="admin-padding-adjustment maintenance-dashboard-property">
                <Modal styles={modalStyles}  open={this.state.modalOpen} onClose={this.onModalClose}>
                    {this.state.documentLink && <GoogleDocumentViewer url={this.state.documentLink}/>}
                </Modal>
                <div className="section-header">
                    <h1>{this.state.address} <i className="oval"/> <span className="document">DOCUMENTS</span></h1>
                </div>
                <ReactTable data={this.state.data}
                            columns={columns}
                            getTdProps={(state, rowInfo, column) => this.handleTableClick(state, rowInfo, column)}
                            pageSize={this.state.count}
                            showPagination={false}
                            loading={this.state.loading}/>
                          <form className="add-maintenance button-section">
                    <button className="button save-button" type="button" value="Add Document"
                            onTouchTap={this.handleAddOpen}>
                        Add Document
                    </button>
                </form>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.openAdd}
                    onRequestClose={this.handleAddClose}
                    bodyClassName="document-add-modal-body"
                    contentClassName="document-add-modal-root"
                    actionsContainerClassName="document-add-modal-action"
                >
                    <div className="title">{actionTitle} document to</div>
                    <div className="address">{this.state.address}</div>
                    <SelectCategory
                        title={'Category'}
                        name={'category'}
                        controlFunc={this.handleCategorySelect}
                        options={this.state.categories}
                        selectedOption={this.state.category_id}
                        disable={this.state.categoryDisabled}/>
                    <SelectDocument
                        title={'Document'}
                        name={'document'}
                        controlFunc={this.handleDocumentSelect}
                        options={this.state.documents}
                        selectedOption={this.state.document_id}
                        disable={this.state.categoryDisabled}/>
                    <DropZone onDrop={this.onDropFiles} className="col-xs-12 drop-zone-content">
                      <div className="upload-icon"><img src={uploadIcon}/></div> Drag & drop, or browse.
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
                    Discard draft?
                </Dialog>
            </div>
        );
    }
}
