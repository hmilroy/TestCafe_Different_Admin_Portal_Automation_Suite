import React from 'react';
import './styles.scss';
import PropertyKeyStore from '../../../../stores/PropertyKeysStore';
import PropertyKeyService from '../../../../services/PropertyKeysService';
import apiConstants from '../../../../constants/apiConstants';
import Toastr from 'toastr';

export default class Access extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            keyNumber: '',
            note: '',
            hasLeasing: false,
            hasManagement: true,
            hasTenant: false,
            availableKeys: []
        }
        this._mount = false;
        this.handleClickEdit = this.handleClickEdit.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.setData = this.setData.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
    }

    componentDidMount() {
        this._mount = true;
        PropertyKeyService.fetchKeys(this.props.propertyId);
        PropertyKeyStore.on('change', this.setData)
    }

    setData() {
        if (this._mount) {
            this.setState({
                note: PropertyKeyStore._notes,
                keyNumber: PropertyKeyStore._keyNumber,
                hasLeasing: PropertyKeyStore._hasLeasing,
                hasManagement: PropertyKeyStore._hasManagement,
                hasTenant: PropertyKeyStore._hasTenant,
                availableKeys: PropertyKeyStore._availableKeys
            });
        }
    }

    componentWillUnmount(){
        this._mount = false;
        PropertyKeyStore.removeListener('change', this.setData);
    }

    handleChangeNote(e) {
        this.setState({
            note: e.target.value
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

    handleClickSave() {
        let payload = {
            property_id: this.props.propertyId,
            notes: this.state.note,
            has_leasing_key: this.state.hasLeasing,
            has_management_key: this.state.hasManagement,
            has_tenant_key: this.state.hasTenant
        };
        PropertyKeyService.updateKeys(payload)
            .then((result) => {
                if (!_.isUndefined(result.status.message)) {
                    Toastr.success(result.status.message);
                }
                let _availableKeys = [];
                if (this.state.hasLeasing) {
                    _availableKeys.push(apiConstants.KEYS.LEASING);
                }
                if (this.state.hasManagement) {
                    _availableKeys.push(apiConstants.KEYS.MANAGEMENT);
                }
                if (this.state.hasTenant) {
                    _availableKeys.push(apiConstants.KEYS.TENANT);
                }
                this.setState({
                    isEditing: false,
                    availableKeys: _availableKeys
                });
            });
    }

    handleKeyChange(e) {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }

    renderEdit() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text">Key Number</label></div>
                    <div className="col-xs-10"><p className="content_text">{this.state.keyNumber}</p></div>
                </div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text">Keys We Have</label></div>
                    <div className="col-xs-10">
                    <label className="content_text access_checkbox"><input className="DA-CheckboxItem__checkbox" checked={this.state.hasLeasing}
                                  type="checkbox" name="hasLeasing" onChange={this.handleKeyChange}/>
                        <span className="DA-CheckboxItem__label TOItem">Leasing</span>
                    </label>
                    <label className="content_text access_checkbox"><input className="DA-CheckboxItem__checkbox" checked={this.state.hasManagement}
                                  type="checkbox" name="hasManagement" onChange={this.handleKeyChange}/>
                        <span className="DA-CheckboxItem__label TOItem">Management</span>
                    </label>
                    <label className="content_text access_checkbox"><input className="DA-CheckboxItem__checkbox" checked={this.state.hasTenant}
                                  type="checkbox" name="hasTenant" onChange={this.handleKeyChange}/>
                        <span className="DA-CheckboxItem__label TOItem">Tenant</span>
                    </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text notes_label">Access Notes</label></div>
                    <div className="col-xs-10"><textarea type="text" value={this.state.note} onChange={this.handleChangeNote} rows="3" className="access_note"/></div>
                </div>
                <div className="row">
                    <button className="button bill-button access_button" onClick={this.handleClickCancel}>Cancel</button>
                    <button className="button button_main bill-button access_button" onClick={this.handleClickSave}>Save</button>
                </div>
            </div>
        )
    }

    renderView() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text">Key Number</label></div>
                    <div className="col-xs-10"><p className="content_text">{this.state.keyNumber}</p></div>
                </div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text">Keys We Have</label></div>
                    <div className="col-xs-10">{this.state.availableKeys.map((aKey)=> <span key={aKey} className="content_text keys_span">{aKey}</span>)}</div>
                </div>
                <div className="row">
                    <div className="col-xs-2"><label className="label_text notes_label">Access Notes</label></div>
                    <div className="col-xs-10"><p className="content_text notes_p">{this.state.note}</p></div>
                </div>
                <div className="row">
                    <button className="button button_main bill-button access_button" onClick={this.handleClickEdit}>Edit</button>
                </div>
            </div>
        )
    }

    render() {
        let viewPort = null;
        if (this.state.isEditing) {
            viewPort = this.renderEdit();
        } else {
            viewPort = this.renderView();
        }

        return (
            <div className="payment-section">
                {viewPort}
            </div>
        )
    }
}