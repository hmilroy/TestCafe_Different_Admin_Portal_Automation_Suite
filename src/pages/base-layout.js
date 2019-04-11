import React from 'react'
import AddProperty from './add-property/index.jsx';

export default class BaseLayout extends React.Component {
    render() {
        return (
            <div>
                <AddProperty/>
            </div>
        );
    }
}