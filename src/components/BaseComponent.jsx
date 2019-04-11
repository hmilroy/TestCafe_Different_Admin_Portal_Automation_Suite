/**
 * @author Bhanuka Mallawaarachchi
 */
import React from 'react';

class BaseComponent extends React.Component {

    constructor(props) {
        super(props);
        this.bindMethods = this.bindMethods.bind(this);
        this.bindMethods(['setStateSafe']);
        this._mount = false;
    }

    bindMethods(array) {
        array.forEach((name) => {
            this[name] = this[name].bind(this);
        });
    }

    setStateSafe(obj, cb) {
        if(this._mount) {
            this.setState(obj, () => {
                if (cb) {
                    cb();
                }
            });
        }
    }
}

export default BaseComponent;