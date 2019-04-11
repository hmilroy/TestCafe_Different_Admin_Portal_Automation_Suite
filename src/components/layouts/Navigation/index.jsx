import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import BaseComponent from '../../../components/BaseComponent.jsx';
import Auth from '../../../services/AuthService.js';
import Toastr from 'toastr';
import LoginStore from '../../../stores/LoginStore';
import _ from 'underscore';
import UiStore from '../../../stores/UiStore';
import './navigation.scss';

export default class NavigationTabs extends BaseComponent{

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            activeTab: 'dashboard'
        };

        this.bindMethods([
            'setActiveTab',
            'handleRequestClose',
            'handleTouchTap',
            'logout',
            'updateFromStore'
        ]);
    }

    componentDidMount() {
        UiStore.on('change', this.updateFromStore);
    }

    componentWillUnmount() {
        UiStore.removeListener('change', this.updateFromStore);
    }

    updateFromStore() {
        this.setState({
            activeTab: UiStore.activeNavTab
        });
    }

    setActiveTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    handleTouchTap(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    };

    handleRequestClose(){
        this.setState({
            open: false
        });
    };

    logout() {
        Auth.logout();
        Toastr.options.positionClass="toast-top-full-width";
        Toastr.success("Logged Out! Bye!");
    }

    render(){
        let topNavIconClass = 'top-nav-icon';
        let type = 'dashboard';
        let dashboardClassName = `${topNavIconClass}  ${type} `;

        if (this.state.activeTab === type) {
            dashboardClassName  += topNavIconClass + '--active';
        }

        type = 'add-property';
        let addPropertyClassName = `${topNavIconClass}  ${type} `;
        if (this.state.activeTab === type) {
            addPropertyClassName += topNavIconClass + '--active';
        }

        type = 'add-person';
        let addPersonClassName = `${topNavIconClass}  ${type} `;
        if (this.state.activeTab === type) {
            addPersonClassName += topNavIconClass + '--active';
        }

        return(
            <div className="col-xs">
            <div className="icon-bar row">
                <a href="/#/" onClick={() => this.setActiveTab('dashboard')}
                   className={this.state.activeTab === 'dashboard' ? "active-top-nav top-nav-link" : "top-nav-link"}>
                    <div className={dashboardClassName}></div>
                </a>
                <a href="/#/add-property" onClick={() => this.setActiveTab('add-property')}
                   className={this.state.activeTab === 'add-property' ? "active-top-nav top-nav-link" : "top-nav-link"}>
                    <div className={addPropertyClassName}></div>
                </a>
                <a href="/#/add-person" onClick={() => this.setActiveTab('add-person')}
                   className={this.state.activeTab === 'add-person' ? "active-top-nav top-nav-link" : "top-nav-link"}>
                    <div className={addPersonClassName}></div>
                </a>
                <a href="/#/" onClick={this.handleTouchTap}
                   className={this.state.activeTab === 'profile' ? "active-top-nav row" : "row"}>
                    {!_.isNull(LoginStore.userObject) && !_.isNull(LoginStore.userObject.profileImgUrl) &&
                    <div className="col"><img className="img-circle" src={LoginStore.userObject.profileImgUrl}/></div>}
                    <div className="col user-name">Hello, <span>{LoginStore.userName}</span></div>
                    <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}
                        animated={false}
                        animation={PopoverAnimationVertical}
                        onTouchTap={false}
                    >
                        <Menu className="force-muli">
                            <a href="/#/setting">
                                <MenuItem value={1} primaryText="Settings"
                                          onClick={() => this.setActiveTab('profile') }/>
                            </a>
                            <MenuItem value={2} primaryText="Logout" onTouchTap={() => this.logout()}/>
                        </Menu>
                    </Popover>
                </a>
            </div>
            </div>
        );
    }
}