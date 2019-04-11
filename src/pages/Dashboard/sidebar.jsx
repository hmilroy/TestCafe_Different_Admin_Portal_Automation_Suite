import React from 'react';
import ReactTooltip from 'react-tooltip';
import UiStore from '../../stores/UiStore';
import UiService from '../../services/UiService';
import './sidebar.scss';

export default class sideBarContent extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'properties'
        };
        this.setActiveTab = this.setActiveTab.bind(this);
        this.updateFromUiStore = this.updateFromUiStore.bind(this);
    }

    componentDidMount() {
        UiStore.on('change', this.updateFromUiStore);
    }

    componentWillUnmount() {
        UiStore.removeListener('change', this.updateFromUiStore);
    }

    updateFromUiStore() {
        this.setState({
            activeTab: UiStore.activeDashboardTab
        });
    }

    setActiveTab(tab) {
        UiService.changeDashboardTab({
            activeTab: tab
        });
    }

    render () {
        const linkClass = 'dashbaord-side-link';
        const topNavIconClass = 'side-dashboard-icon';

        let type = 'properties';
        let propertiesClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            propertiesClassName  += topNavIconClass + '--active';
        }
        type = 'maintenance';
        let maintenanceClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            maintenanceClassName  += topNavIconClass + '--active';
        }
        type = 'renewals';
        let renewalsClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            renewalsClassName  += topNavIconClass + '--active';
        }
        type = 'reports';
        let reportsClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            reportsClassName  += topNavIconClass + '--active';
        }
        type = 'holdings';
        let holdingsClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            holdingsClassName += topNavIconClass + '--active';
        }
        type = 'transactions';
        let transactionsClassName = `${topNavIconClass} ${type} `;
        if (this.state.activeTab === type) {
            transactionsClassName += topNavIconClass + '--active';
        }

        return (
            <div className="side-icon-bar dashboard-sidebar">
                <a  href="/#/" onClick={() => this.setActiveTab('properties')}
                    className={this.state.activeTab==='properties' ? "active " + linkClass : linkClass}
                    alt="Properties" data-tip="Properties">
                    <div className={propertiesClassName}></div>
                </a>
                <a href="/#/maintenance" onClick={() => this.setActiveTab('maintenance')}
                   className={this.state.activeTab==='maintenance' ? "active " + linkClass : linkClass}
                   alt="Maintenance" data-tip="Maintenance">
                    <div className={maintenanceClassName}></div>
                </a>
                <a href="/#/reports" onClick={() => this.setActiveTab('reports')}
                   className={this.state.activeTab==='reports' ? "active " + linkClass: linkClass}
                   alt="Reports" data-tip="Reports">
                    <div className={reportsClassName}></div>
                </a>
                <a href="/#/transactions" onClick={() => this.setActiveTab('transactionsaa')}
                    className={this.state.activeTab === 'transactions' ? "active Transactions " + linkClass : linkClass}
                    alt="Transactions" data-tip="Transactions">
                    <div className={transactionsClassName}></div>
                </a>
                <a href="/#/holdings" onClick={() => this.setActiveTab('holdings')}
                    className={this.state.activeTab === 'holdings' ? "active Holdings " + linkClass : linkClass}
                    alt="Holdings" data-tip="Holding Deposits">
                    <div className={holdingsClassName}></div>
                </a>
                <ReactTooltip  place="right" type="dark" effect="solid"/>
            </div>
        );
    }
}
