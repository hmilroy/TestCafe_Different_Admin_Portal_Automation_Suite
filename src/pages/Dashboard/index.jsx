import React from 'react';
import './dashboard.scss';
import SideBar from './sidebar.jsx';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="row dashboard">
                <div className="col">
                    <SideBar/>
                </div>
                <div className="col content-dashboard">
                    {this.props.children}
                </div>
            </div>
        );
    }
}