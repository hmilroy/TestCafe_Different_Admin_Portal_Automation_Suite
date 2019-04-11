import React from 'react';

const SettingsForm = (props) => (
    <form className="add-person-form" onSubmit={props.submitForm}>
        <div className="form-header">
            <h1>Profile Settings</h1>
        </div>
        <div className="inner-form">
            <div className="form-group row element">
                <label className="form-label col-xs-6">{props.user.name}</label>
            </div>
            <div className="form-group row element">
                <label className="form-label col-xs-6">{props.user.email}</label>
            </div>
            {!props.editDisabled && (
                <div>
                    <div className="form-group row element">
                        <input type="password"
                               className="form-input col-xs-4"
                               placeholder="current password"
                               onChange={props.currentPasswordChange}
                               required/>
                    </div>
                    <div className="form-group row element">
                        <input type="password"
                               className="form-input col-xs-4"
                               onChange={props.newPasswordChange}
                               placeholder="new password"
                               required/>
                    </div>
                    <div className="bottom-buttons">
                        <button value="cancel" onClick={props.handleEditClick}>Cancel</button>
                        <button type="submit" className="save-button" value="Save">Save</button>
                    </div>
                </div>
            )}
            {props.editDisabled && (
                <div>
                    <div className="form-group row element">
                        <label className="form-label col-xs-3">Password</label>
                        <input type="password"
                               className="form-input col-xs-4"
                               value="password text"
                               disabled={props.editDisabled}/>
                    </div>
                    <div className="bottom-buttons">
                        <button value="save-button" onClick={props.handleEditClick}>Edit</button>
                    </div>
                </div>
            )}
        </div>
    </form>
);

SettingsForm.propTypes = {
    editDisabled: React.PropTypes.bool.isRequired,
    handleEditClick: React.PropTypes.func.isRequired,
    currentPasswordChange: React.PropTypes.func.isRequired,
    newPasswordChange: React.PropTypes.func.isRequired,
    submitForm: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired
};

export default SettingsForm;