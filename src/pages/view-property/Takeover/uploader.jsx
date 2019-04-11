import React from 'react';
import Dropzone from 'react-dropzone'
import _ from 'underscore';
import Toastr from 'toastr';
import TakeoverService from '../../../services/TakeoverService';
import TakeoverAction from '../../../actions/TakeoverAction';
import API_CONSTANTS from '../../../constants/apiConstants';
import ConfirmDialog from '../../../components/dialogs/confirm.jsx'
import loaderIcon from '../../../assets/images/loader.png';
import typecast from 'typecast';

export default class Uploader extends React.Component {

    constructor(props) {
        super(props);
        let containerClassName = '',
            hintTextClassName = '',
            uploaderClassName = '';
        if (!_.isUndefined(props.classNames.container)) {
            containerClassName = props.classNames.container;
        }
        if (!_.isUndefined(props.classNames.hintText)) {
            hintTextClassName = props.classNames.hintText;
        }
        if (!_.isUndefined(props.classNames.uploader)) {
            uploaderClassName = props.classNames.uploader;
        }
        this.state = {
            files: [],
            containerClassName: containerClassName,
            hintTextClassName: hintTextClassName,
            uploaderClassName: uploaderClassName,
            isConfirmOpen: false,
            uploading: false,
            message: ''
        };
        this.closeConfirm = this.closeConfirm.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    onDrop(files) {
        this.setState({
            files
        });
        if (!_.isUndefined(files[0])) {
            let file = files[0];
            let data = {
                category_id: this.props.category.ID,
                property_id: this.props.propertyId,
                category_name: this.props.category.FIELD,
                replace: this.props.hasFile,
                document_name_field: this.props.category.FILE_NAME
            };
            if (file.type === "application/pdf") {
                data.PDF_1 = file;
            } else {
                data.IMG_1 = file;
            }
            this.setState({
                uploading: true,
                message: 'Uploading'
            });
            this.handleUpload(data);
        }
    }

    disableCheckBox() {
        TakeoverAction.changeCheckboxStatus({
            list_item: API_CONSTANTS.TAKE_OVER.CONFIRM.ADD_KEY_DOCUMENTS,
            item_status: API_CONSTANTS.TAKE_OVER.CHECKBOX_STATUS.DISABLED
        });
    }

    handleUpload(data) {
        if (data.replace !== true) {
            this.disableCheckBox();
        }
        TakeoverService.uploadDocument(data)
            .then((res) => {
                if(!_.isUndefined(res.status.code)) {
                    switch(res.status.code) {
                        case 200:
                            Toastr.success(res.status.message);
                            break;
                        default:
                            break;
                    }
                }
                this.setState({
                    uploading: false
                });
                if (data.replace !== true) {
                    setTimeout(()=> {
                        TakeoverService.fetchTakeoverInfo(this.props.propertyId)
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    uploading: false
                });
            });
    }

    removeFile() {
        this.setState({
            files: [],
            isConfirmOpen: false
        });
        let data = {
            property_id: this.props.propertyId,
            category_id: this.props.category.ID,
            category_name: this.props.category.FIELD,
            document_name_field: this.props.category.FILE_NAME
        };
        this.setState({
            uploading: true,
            message: 'Deleting'
        });
        this.disableCheckBox();
        TakeoverService.removeDocument(data)
            .then((res) => {
                if(!_.isUndefined(res.status.code)) {
                    switch(res.status.code) {
                        case 200:
                            Toastr.success(res.status.message);
                            break;
                        default:
                            break;
                    }
                }
                this.setState({
                    uploading: false
                });
                TakeoverService.fetchTakeoverInfo(this.props.propertyId)
            })
            .catch((error) => {
                this.setState({
                    uploading: false
                });
            })
    }

    confirmDelete(e) {
        e.stopPropagation();
        this.setState({
            isConfirmOpen: true
        });
    }

    closeConfirm() {
        this.setState({
            isConfirmOpen: false
        });
    }

    render() {
        let accept = {
            borderColor: '#2de8ae'
        };
        let uploaderClass = this.state.uploaderClassName;
        if (this.props.hasFile === true) {
            uploaderClass += ' hasFile';
        }
        const confirmLabels = {
            yes: 'Delete',
            no: 'Cancel'
        };
        const style = {
            container: {
                position: 'relative',
            },
            refresh: {
                display: 'inline-block',
                position: 'relative',
            },
        };

        return (
            <div className={this.state.containerClassName} >
                <ConfirmDialog
                    labels={confirmLabels}
                    title={"Deleting " + typecast(this.props.fileType, 'string').toLowerCase() + " document"}
                    message={"Are you sure you want to delete " + this.props.fileName + "?"}
                    isOpen={this.state.isConfirmOpen}
                    close={this.closeConfirm}
                    confirmAction={this.removeFile}/>
                <Dropzone
                    acceptStyle={accept}
                    accept="application/pdf, image/*"
                    className={uploaderClass}
                    disabled={this.props.disabled}
                    onDrop={this.onDrop}>
                    {(this.state.files.length > 0 || this.props.hasFile === true) && !this.props.disabled && !this.state.uploading &&
                    <div data-tip="People" onClick={this.confirmDelete} className=" DA-Uploader__clear"></div>}
                    <p className={this.state.hintTextClassName}>{this.props.fileType}</p>
                </Dropzone>

                    {
                        // this.state.files.map(f => <p className="DA-Uploader__fileName" key={f.name}>{f.name} - {f.size} bytes</p>)
                    }
                {this.state.uploading === false && this.props.hasFile === true && <p className="DA-Uploader__fileName">{this.props.fileName}</p>}
                {this.state.uploading && <div className="DA-Uploader__loader">
                    <p className="DA-Uploader__loader__text">{this.state.message} </p>
                    <img className="DA-Uploader__loader__img" src={loaderIcon} />
                </div>}
            </div>
        );
    }
}

Uploader.propTypes = {
    // fileName: React.PropTypes.string.isRequired,
    // category: React.PropTypes.object.isRequired
};

Uploader.defaultProps = {
    fileName: 'props.fileName',
    fileType: 'props.fileType',
};