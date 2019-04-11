import React from 'react';

import AddPersonFormOld from '../../components/Forms/AddPersonFormOld.jsx';
import AddPersonForm from '../../components/Forms/AddPersonForm.jsx';

export default class AddPerson extends React.Component {

    render() {
        return (
            <div>
                <AddPersonForm/>
        { false && <AddPersonFormOld/> }
            </div>
        );
    }
}