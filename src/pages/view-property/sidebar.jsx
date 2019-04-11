import React from 'react';
import ReactTooltip from 'react-tooltip';
import PropertyStore from '../../stores/PropertyStore';
import OptimalHash from '../../utility/optimus.js';
import UiStore from '../../stores/UiStore';
import UiService from '../../services/UiService';
import BaseComponent from '../../components/BaseComponent.jsx';
import './property.scss';

export default class sideBarContent extends BaseComponent{
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'Takeover'
        };

        this.bindMethods([
            'setActiveTab',
            'changeTab'
        ]);
    }

    setActiveTab(tab) {
        let activeTab = {
            activeTab: tab
        };
        UiService.changePropertyTab(activeTab);
    }

    changeTab() {
        this.setState({
            activeTab: UiStore.activePropertyTab
        });
    }

    componentDidMount() {
        UiStore.on('change', this.changeTab);
    }

    componentWillUnmount() {
        UiStore.removeListener('change', this.changeTab);
    }

    render () {
        return (
            <div className="side-icon-bar property-side-bar SideBar">
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/takeover" }
                    onClick={() => this.setActiveTab('Takeover')}
                    className={(this.state.activeTab==='Takeover' ? "active" : "") + " SideBar__link"}
                    alt="Take Over" data-tip="Take Over">
                    {this.state.activeTab==='Takeover' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active takeover-icon"></div>
                        : <div className="PropertySideBar__icon takeover-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/property"  }
                    onClick={() => this.setActiveTab('Property')}
                    className={(this.state.activeTab==='Property' ? "active" : "") + " SideBar__link"}
                    alt="Property" data-tip="Property">
                    {this.state.activeTab==='Property' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active property-icon"></div>
                        : <div className="PropertySideBar__icon property-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/people"}
                    onClick={() => this.setActiveTab('People')}
                    className={(this.state.activeTab==='People' ? "active" : "") + " SideBar__link"}
                    alt="People" data-tip="People">
                    {this.state.activeTab==='People' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active people-icon"></div>
                        : <div className="PropertySideBar__icon people-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/payment"}
                    onClick={() => this.setActiveTab('Payment')}
                    className={(this.state.activeTab==='Payment' ? "active" : "") + " SideBar__link"}
                    alt="Payments" data-tip="Payments">
                    {this.state.activeTab==='Payment' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active payments-icon"></div>
                        : <div className="PropertySideBar__icon payments-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/maintenance"}
                    onClick={() => this.setActiveTab('Maintenance')}
                    className={(this.state.activeTab==='Maintenance' ? "active" : "") + " SideBar__link"}
                    alt="Maintenance" data-tip="Maintenance">
                    {this.state.activeTab==='Maintenance' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active maintenance-icon"></div>
                        : <div className="PropertySideBar__icon maintenance-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/inspection"}
                    onClick={() => this.setActiveTab('Inspection')}
                    className={(this.state.activeTab==='Inspection' ? "active" : "") + " SideBar__link"}
                    alt="Inspections" data-tip="Inspections">
                    {this.state.activeTab==='Inspection' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active inspections-icon"></div>
                        : <div className="PropertySideBar__icon inspections-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/key"}
                    onClick={() => this.setActiveTab('Key')}
                    className={(this.state.activeTab==='Key' ? "active" : "") + " SideBar__link"}
                    alt="Keys" data-tip="Keys">
                    {this.state.activeTab==='Key' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active keys-icon"></div>
                        : <div className="PropertySideBar__icon keys-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/message"}
                    onClick={() => this.setActiveTab('Message')}
                    className={(this.state.activeTab==='Message' ? "active" : "") + " SideBar__link"}
                    alt="Messages" data-tip="Messages">
                    {this.state.activeTab==='Message' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active messages-icon"></div>
                        : <div className="PropertySideBar__icon messages-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/document"}
                    onClick={() => this.setActiveTab('Document')}
                    className={(this.state.activeTab==='Document' ? "active" : "") + " SideBar__link"}
                    alt="Documents" data-tip="Documents">
                    {this.state.activeTab==='Document' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active documents-icon"></div>
                        : <div className="PropertySideBar__icon documents-icon"></div>
                    }
                </a>
                <a  href={"/#/view-property/" + OptimalHash.encode(PropertyStore.propertyId) + "/vacancy"}
                    onClick={() => this.setActiveTab('Vacancy')}
                    className={(this.state.activeTab==='Vacancy' ? "active" : "") + " SideBar__link"}
                    alt="Vacancy" data-tip="Vacancy">
                    {this.state.activeTab==='Vacancy' ?
                        <div className="PropertySideBar__icon PropertySideBar__icon--active vacancy-icon"></div>
                        : <div className="PropertySideBar__icon vacancy-icon"></div>
                    }
                </a>
                <ReactTooltip  place="right" type="dark" effect="solid"/>
            </div>
        )
    }
}
