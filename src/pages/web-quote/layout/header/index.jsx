/**
 * @file Manages layout for Header.
 * @author Usaidh Mohamed
 */
import React, {Component} from 'react';
import Momemnt from 'moment';

import MaintenanceService from '../../../../services/MaintenanceService';
import QuoteStore from '../../../../stores/QuoteStore';

import './header.scss';

export class Header extends Component {

    /**
     * @constructs
     * @param {object} props Default props
     */
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            date: null
        };
    }

    componentDidMount() {
        MaintenanceService.getQuoteDetals(QuoteStore.hash)
            .then( result => {
                this.setState({
                    company: result.data.tradie.company,
                    date: Momemnt(result.data.createdAt).format('MMM DD, YYYY')
                })
            })
    }

    /**
     * @function render
     * @description Render HTML
     * @return {XML} React component
     */
    render() {
        return (
            <header className="different-header">
                <div className="container row">
                    <div className="different-logo small-logo col-xs-6 col-md-2">
                        <img className="image"/>
                    </div>
                    <div className="different-user right-align-header  company col-md-7 col-xs-10">
                        {this.state.company}
                    </div>
                    <div className="different-user maintenance-date right-align-header col-xs-6 col-md-3">
                        {this.state.date}
                    </div>
                    <div className="right-align-header col-xs-6 col-md-2 padding-top">
                        <div className="row">
                            <div className="col-xs-12 small-company">{this.state.company}</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 small-date">{this.state.date}</div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
