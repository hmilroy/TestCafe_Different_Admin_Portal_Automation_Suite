import React from 'react';
import _ from 'underscore';
import PropertyStore from '../../../stores/PropertyStore';
import PropertyService from '../../../services/PropertiesServices';
import OptimalHash from '../../../utility/optimus';
import PropertyKeyService from '../../../services/PropertyKeysService';
import './keys.scss';

import Access from './access/index.jsx';


export default class Keys extends React.Component {
    constructor(props) {
        super(props);
        let address = '';
        if (!_.isUndefined(PropertyStore.property) && !_.isUndefined(PropertyStore.property.addr_street_address)) {
            address = PropertyStore.property.addr_street_address;
        }
        this.state = {
            address,
            property: PropertyStore.property,
            value: 'ACCESS'
        };

        this.handleChange = this.handleChange.bind(this);
        this._mount = false;
    }

    componentDidMount() {
        this._mount = true;
        let self = this;
        const propertyId = OptimalHash.decode(this.props.params.id);
        this.setState({
            propertyId: propertyId
        });

        PropertyService.viewProperty(propertyId)
            .then((value) => {
                if (self._mount) {
                    let property = value.status.data;
                    this.setState({
                        address: property.addr_street_address
                    });
                }
            });
    }

    componentWillUnmount() {
        this._mount = false;
    }

    handleChange(value) {
        this.setState({
            value
        });
    }

    render(){
        return (
            <div className="admin-padding-adjustment add-person-form people-tab">
                <div className="section-header">
                    <h1>{this.state.address} <i className="oval"/>
                        <span className="document">KEYS</span>
                    </h1>
                </div>
                {this.state.value === 'ACCESS' && <Access propertyId={OptimalHash.decode(this.props.params.id)}/>}
            </div>
        );
    }
}