import React from 'react';
import SettingsForm from '../../components/Forms/SettingsForm.jsx';
import Toastr from 'toastr';

import User from '../../stores/LoginStore';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editDisabled: true,
            user: {},
            currentPassword: '',
            newPassword: ''
        };

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleCurrentPasswordChange(e) {
        this.setState ({
            currentPassword: e.target.value
        })
    }
    handleNewPasswordChange(e) {
        this.setState ({
            newPassword: e.target.value
        })
    }

    componentDidMount() {
        let user = {
            name: User.name,
            email: User.email
        };

        this.setState({
            user: user
        })
    }

    handleEditClick() {
        this.setState({
            editDisabled: !this.state.editDisabled
        })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            editDisabled: true
        });
        const formPayload = {
            name: this.state.name,
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword
        };
        Toastr.success("Success! Password updated.");
    }

    render() {
        return (
            <SettingsForm
                user={this.state.user}
                editDisabled={this.state.editDisabled}
                handleEditClick={this.handleEditClick}
                newPasswordChange={this.handleNewPasswordChange}
                currentPasswordChange={this.handleCurrentPasswordChange}
                submitForm = {this.handleFormSubmit}/>
        );
    }
}