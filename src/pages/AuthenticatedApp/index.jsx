import React from 'react';
import LoginStore from '../../stores/LoginStore.js';
import BlockingStore from '../../stores/BlockingStore.js';
import QuoteActions from '../../actions/QuoteActions.js';
import AuthService from '../../services/AuthService.js';
import _ from 'underscore';
import Header from '../../components/layouts/Header/index.jsx';
import Login from '../../pages/login/index.jsx';
import {QuoteRequest, QuoteComplete} from '../../pages/web-quote/index.jsx';
import UiBlocker from '../../components/elements/UiBlocker.jsx';
import dig from 'object-dig';
import UiService from '../../services/UiService';

export default class AuthenticatedApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this._getLoginState();
        this.handleTabSelection = this.handleTabSelection.bind(this);
    }

    _getLoginState() {
        return {
            userLoggedIn: LoginStore.isLoggedIn(),
            blocking: BlockingStore.blocking
        };
    }

    handleTabSelection(props) {
        switch (props) {
            case '/add-person':
                UiService.changeNavTab({
                    activeTab: 'add-person'
                });
                break;
            case '/add-property':
                UiService.changeNavTab({
                    activeTab: 'add-property'
                });
                break;
            case '/renewals':
                UiService.changeDashboardTab({
                    activeTab: 'renewals'
                });
                break;
            case (props.match(/reports/) ? props : '/reports') :
                UiService.changeDashboardTab({
                    activeTab: 'reports'
                });
                break;
            case '/maintenance':
                UiService.changeDashboardTab({
                    activeTab: 'maintenance'
                });
                break;
            case '/transactions':
                UiService.changeDashboardTab({
                    activeTab: 'transactions'
                });
                break;
            case '/holdings':
                UiService.changeDashboardTab({
                    activeTab: 'holdings'
                });
                break;
            default:
                UiService.changeNavTab({
                    activeTab: 'dashboard'
                });
                UiService.changeDashboardTab({
                    activeTab: 'properties'
                });
                break;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(dig(nextProps, 'location', 'pathname')) && !_.isUndefined(dig(this.props, 'location', 'pathname')) &&  this.props.location.pathname !== nextProps.location.pathname) {
            this.handleTabSelection(nextProps.location.pathname);
        }
    }

    componentDidMount() {
        BlockingStore.on('change', ()=> {
            this.setState({
                blocking: BlockingStore.blocking
            });
        });
        this.changeListener = this._onChange.bind(this);
        LoginStore.addChangeListener(this.changeListener);
        if (!_.isUndefined(dig(this.props, 'location', 'pathname'))) {
            this.handleTabSelection(this.props.location.pathname);
        }
    }

    _onChange() {
        this.setState(this._getLoginState());
    }

    componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener);
        BlockingStore.removeListener('change');
    }

    get viewPort() {
        if (!this.state.userLoggedIn) {
            if (this.props.location.query.t && this.props.location.query.h){
                QuoteActions.quoteRequest(this.props.location.query.h);
                switch (this.props.location.query.t) {
                    case 'quote-request':
                        history.pushState('', '', '/');
                        return (
                            <div>
                                <QuoteRequest/>
                                <UiBlocker blocking={this.state.blocking}/>
                            </div>
                        );
                        break;
                    case 'quote-view':
                        history.pushState('', '', '/');
                        return (
                            <div>
                                <QuoteComplete/>
                                <UiBlocker blocking={this.state.blocking}/>
                            </div>
                        );
                        break;
                }
                history.pushState('', '', '/');
            }
            return (
                <div>
                    <Login/>
                    <UiBlocker blocking={this.state.blocking}/>
                </div>
            )
        }  else {
            return (
                <div>
                    <Header className="row"/>
                    <div className="content-dock">
                        {this.props.children}
                    </div>
                    <UiBlocker blocking={this.state.blocking}/>
                </div>
            )
        }
    }

    logout(e) {
        e.preventDefault();
        AuthService.logout();
    }

    render() {

        return (this.viewPort);
    }

}
