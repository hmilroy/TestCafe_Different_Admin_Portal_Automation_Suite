import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ConfirmDialog = (props)=> {

    const handleClose = (event) => {
        props.close();
    };

    const handleConfirm= (event) => {
        props.confirmAction();
    };

    const actions = [
        <FlatButton
            label={props.labels.no}
            primary={true}
            onClick={handleClose}
        />,
        <FlatButton
            label={props.labels.yes}
            primary={true}
            onClick={handleConfirm}
        />,
    ];

    return (
        <div>
            <Dialog
                title={props.title}
                actions={actions}
                modal={false}
                open={props.isOpen}
                onRequestClose={handleClose}
            >
                {props.message}
            </Dialog>
        </div>
    );
};

export default ConfirmDialog;