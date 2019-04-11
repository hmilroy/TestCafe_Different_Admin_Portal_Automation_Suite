import React from 'react';
import PersonService from '../../services/PersonService';
import PersonStore from '../../stores/PersonStore';
import PropertiesService from '../../services/PropertiesServices';
import ViewPersonForm from '../../components/Forms/ViewPerson.jsx';
import Toastr from 'toastr';
import PropertyActions from '../../actions/ProepertyActions';
import LoginAction from '../../actions/LoginActions';
import BlockingActions from '../../actions/BlockingActions.js';
import OptimalHash from '../../utility/optimus.js';
import _ from 'underscore';
import Countries from '../../../data/countries.json';
import ViewRoles from '../../components/Forms/ViewRoles.jsx';
import AddRoleForm from '../../components/Forms/AddRoleForm.jsx';

import './viewperson.scss';

export default class ViewPerson extends React.Component {
    constructor(props) {
        super(props);
        this.fetchPerson = this.fetchPerson.bind(this);
        let id = this.props.params.id;
        id = OptimalHash.decode(id);
        this.state = {
            view: '',
            person: null,
            email: '',
            name: '',
            phone: '',
            phone_country: '',
            isInitialViewSet: false,
            edit: false,
            isViewSetWhenNoPara: false,
            hasResend: true
        };
        this.handleViewChange = this.handleViewChange.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.renderTab = this.renderTab.bind(this);
        this.setInitalView = this.setInitalView.bind(this);
        this.makeEditable = this.makeEditable.bind(this);
        this.makeNonEditable = this.makeNonEditable.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    componentWillUnmount() {
        setTimeout(()=> {
            PersonService.notAddingRole();
        });
    }

    setInitalView(data) {
        if (!this.state.isInitialViewSet && data.PropertyOwner) {
            this.setState({
                view: 'owner',
                isInitialViewSet: true
            });
        }
        if (!this.state.isInitialViewSet && data.Leases.length) {
            this.setState({
                view: 'tenant',
                isInitialViewSet: true
            });
        }
        if (!this.state.isInitialViewSet && data.Inspector) {
            this.setState({
                view: 'inspector',
                isInitialViewSet: true
            });
        }
        if (!this.state.isInitialViewSet && data.PropertyManager) {
            this.setState({
                view: 'property_manager',
                isInitialViewSet: true
            });
        }
        if (!this.state.isInitialViewSet && data.StrataManager) {
            this.setState({
                view: 'strata_manager',
                isInitialViewSet: true
            });
        }
        if (!this.state.isInitialViewSet && data.Tradie) {
            this.setState({
                view: 'tradie',
                isInitialViewSet: true
            });
        }
        if(PersonStore.isAddingRole) {
            this.setState({
                view: PersonStore.newRole
            });
        }
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    componentDidMount() {
        this.fetchPerson();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.params.id !== nextProps.params.id) {
            // Todo : handle Properly
            window.location.reload();
        }

    }

    handleViewChange(type) {
        this.setState({view: type});
        let newHash= 'view-person/' + OptimalHash.encode(this.state.person.id) + '/' + type;
        window.location.hash = newHash;
        this.setState({
            edit: false
        });
    }

    fetchPerson() {
        setTimeout(BlockingActions.block);
        setTimeout(() => {
            PersonService.findOneUser(OptimalHash.decode(this.props.params.id))
                .then(value=> {
                    PersonService.storePerson(value.data);
                    this.setState({
                        person: value.data,
                        email: value.data.email,
                        name: value.data.name,
                        phone: value.data.tel_number,
                        phone_country: value.data.tel_country_code,
                        hasResend: !value.data.is_signedup
                    });
                    this.setInitalView(value.data);

                    // activate tab according to url once data is received
                    let view = this.props.routeParams.type ? this.props.routeParams.type : '';
                    if (view) {
                        // this.handleViewChange(this.props.routeParams.type);
                        this.handleViewChange(view);
                    }
                    BlockingActions.unblock();
                });
        });
    }

    renderTab(type, name) {
        return(
            <div className={this.state.view == type ? 'active-tab tab' : 'tab'}
                onClick={() => this.handleViewChange(type)}>
                {name.toUpperCase()}
            </div>
        );
    }

    makeEditable() {
        this.setState({
            edit: true
        });
    }

    makeNonEditable() {
        this.setState({
            edit: false
        });
    }

    handlePhoneChange(number, country, code) {
        if(number) {
            this.setState({
                phone: number
            });
        }
        if(country) {
            this.setState({
                phone_country: country
            });
        }
        if(code) {
            this.setState({
                phoneCountryCode: code
            });
        }
    }

    renderForm() {
        let form = null;
        form = <ViewRoles
            className={"person-role-form "+ this.state.view}
            handleParentUpdate={this.fetchPerson}
            makeParentEditable={this.makeEditable}
            makeParentNonEditable={this.makeNonEditable}
            updateParentPhone={this.handlePhoneChange}
            type={this.state.view}
            person={this.state.person}
            personAll={this.state.person}
            email={this.state.email}
            name={this.state.name}
            phone={this.state.phone}
            phone_country={this.state.phone_country}
            countryCode={this.state.phoneCountryCode}
            edit={false || this.state.edit}
            address={this.state.phone_country}
            hasResend={this.state.hasResend}
        />
        if(this.state.view === PersonStore.newRole) {
            form = <AddRoleForm
                    className={"person-role-form "+ this.state.view}
                    role={PersonStore.newRole}
                    phone={this.state.phone}
                    updateParentPhone={this.handlePhoneChange}
                    phoneCountry={this.state.phone_country}
                    countryCode={this.state.phoneCountryCode}
                    />
        }
        return(
            <div className=" col-xs-12">
                {form}
            </div>
        )
    }

    renderTabs() {
        let display = null;
        let owner = null;
        let tenent = null;
        let inspector = null;
        let PropertyManager = null;
        let StrataManager = null;
        let Tradie = null;
        let person = this.state.person;
        let newRole = PersonStore.newRole;
        if(person) {
            owner = (person.PropertyOwner || newRole === 'owner')&& this.renderTab('owner', 'owner');
            tenent = (person.Leases.length || newRole === 'tenant')&& this.renderTab('tenant', 'tenant');
            inspector = (person.Inspector || newRole === 'inspector') && this.renderTab('inspector', 'inspector');
            PropertyManager = (person.PropertyManager || newRole === 'property_manager') && this.renderTab('property_manager', 'property manager');
            StrataManager = (person.StrataManager || newRole === 'strata_manager') && this.renderTab('strata_manager', 'strata manager');
            Tradie = (person.Tradie || newRole === 'tradie') && this.renderTab('tradie', 'tradie');
        }

        return (
            <div className="row col-xs-12 person-role-tabs">
                {owner}
                {tenent}
                {inspector}
                {PropertyManager}
                {StrataManager}
                {Tradie}
            </div>
        );
    }

    render() {
        const TitleBar = this.state.edit ? <input className="person-roles__name" value={this.state.name} onChange={this.handleNameChange}/>
        : <h1 className="person-roles__name_display">{this.state.name}</h1>;
        return(
            <div>
                <div className="admin-padding-adjustment add-person-form people-tab people-tab-gray">
                    <div className="form-header align-left">
                        {TitleBar}
                    </div>
                    {this.renderTabs()}
                    {this.renderForm()}
                </div>
            </div>
            );
    }
}
