import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const UiBlocker = (props)=> {
    if (props.blocking) {
        return (
            <div className="UiBlocker">
                <div className="UiBlocker__mask"></div>
                <div className="UiBlocker__icon">
                    <CircularProgress size={30} thickness={2}/>
                </div>
            </div>
        );
    }
    return null;
};

export default UiBlocker;