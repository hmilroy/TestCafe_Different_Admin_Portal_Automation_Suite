import React from 'react';
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';
import PropertyService from '../../services/PropertiesServices';

class SimpleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: '', placeId: '' };
        this.onChange = (address) => this.setState({ address });
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(value) {
        geocodeByAddress(value)
            .then(object =>  {
                this.setState({
                    address: value,
                    placeId: object[0].place_id
                })
            })
            .then(() => PropertyService.addressSelected(this.state.placeId))
            .catch(error => console.error('Error', error))
    };

    render() {
        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
            type: 'search',
            placeholder: 'Search Addresses...',
        };

        const defaultStyles = {
            root: {
                position: 'relative',
                paddingBottom: '0',
            },
            input: {
                display: 'inline-block',
                width: '100%',
                padding: '10px',
                height: '40px',
                borderRadius: '3px',
                border: '1px solid rgba(190, 190, 190, 0.5)',
                backgroundColor: '#ffffff'
            },
            autocompleteContainer: {
                position: 'absolute',
                top: '100%',
                backgroundColor: 'white',
                border: '1px solid rgba(190, 190, 190, 0.5)',
                width: '100%',
                zIndex: 3
            },
            autocompleteItem: {
                backgroundColor: '#ffffff',
                padding: '10px',
                color: '#555555',
                cursor: 'pointer',
            },
            autocompleteItemActive: {
                backgroundColor: '#fafafa'
            }
        };

        return (
            <div className="form-group row element single-input address-input">
                <label className="form-label col-xs-4">Address</label>
                <div className="col-xs-8 no-padding">
                    <PlacesAutocomplete className="form-input"
                                        inputProps={inputProps}
                                        debounce={500}
                                        styles={defaultStyles}
                                        onSelect={this.handleFormSubmit}/>
                </div>
            </div>
        )
    }
}

export default SimpleForm;