import React from 'react';
import SideBar from './sidebar.jsx';
import PropertyAction from '../../actions/ProepertyActions';
import PropertyKeysAction from '../../actions/PropertyKeysAction';
import UiService from '../../services/UiService';
import {capitalize} from '../../utility/helpers';
import OptimalHash from '../../utility/optimus.js';

export default class ViewProperty extends React.Component {
    constructor(props) {
        super(props);
        PropertyAction.viewProperty(OptimalHash.decode(this.props.params.id));
    }

    componentWillUnmount() {
        setTimeout(PropertyKeysAction.resetKeys);
    }

    componentDidMount() {
        const paths = this.props.location.pathname.split('/');
        const tabName = paths[paths.length - 1];
        if (isNaN(tabName)) {
            UiService.changePropertyTab({
                activeTab: capitalize(tabName)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id)  {
            UiService.changePropertyTab({
                activeTab: "Property"
            });
        }
    }

    render() {
        return (
            <div className="row dashboard">
                <div className="col property">
                    <SideBar/>
                </div>
                <div className="col dashboard-content-area">
                    {this.props.children}
                </div>
            </div>
        );
    }
}