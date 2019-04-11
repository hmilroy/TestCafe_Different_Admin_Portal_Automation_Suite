import React from 'react';
import ImageViewer from './imageViewer';
import './style.scss';

const GoogleDocViewer = (props) => {
    let view = null;
    let fileType = '';
    let url = '';
    let urlFirstPart = '';
    let names = '';
    let docViewerSrc = '';

    try {
        if (props.url) {
            url = props.url;
        }
        urlFirstPart = url.split('?')[0];
        names = urlFirstPart.split('.');
        fileType = names[names.length - 1];
        if (props.url !== '') {
            docViewerSrc = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&rm=minimal&embedded=true';
        }
    } catch(e) {
        view = null;
    }

    if (fileType.toLowerCase() === 'pdf') {
        view = <iframe className="googleDocViewer" src={docViewerSrc}></iframe>;
    } else {
        view = <div>
            <ImageViewer src={props.url}/>
        </div>;
    }

    return (view);
};

GoogleDocViewer.propTypes = {
   url: React.PropTypes.string.isRequired
};

export default GoogleDocViewer;