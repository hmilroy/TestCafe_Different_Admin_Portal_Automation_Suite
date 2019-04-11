import React from 'react';
import { Link } from 'react-router';

import Navigation from '../Navigation/index.jsx';
import Search from '../Search/index.jsx';
import logoImage from '../../../assets/images/logo-vector-roof@2x.png';

import './header.scss';

export default class NavMain extends React.Component {
    render () {
        return (
            <div className="row bordered-header">
                <div className="different-logo center-xs">
                    <Link to={'/'}><img className="NavLogo" src={logoImage}/></Link>
                </div>
                <Search/>
                <Navigation/>
            </div>
        )
    }
}