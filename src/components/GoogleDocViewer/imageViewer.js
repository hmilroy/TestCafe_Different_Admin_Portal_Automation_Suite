import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import loaderImage from '../../assets/images/loader.png';

const loading = (
    <div className="PdfView__loader">
        <div>
            <div className="PdfView__loader__content">
                <img className="PdfView__loader__image" src={loaderImage} />
                <p>Loading</p>
            </div>
        </div>
    </div>
);

class ImageViewer extends BaseComponent {
    constructor(props) {
        super(props);
        this.bindMethods([
            'handleLoad'
        ]);
        this.state = {
            imageLoaded: false
        };
    }

    handleLoad() {
        this.setState({
            imageLoaded: true
        });
    }

    render() {
        let imageClass = 'documentImage documentImage--loading';
        if(this.state.imageLoaded) {
            imageClass = 'documentImage';
        }
        let view = <div className="documentImageViewer">
            {!this.state.imageLoaded && loading}
            <img className={imageClass} onLoadedData={this.handleLoaded} onLoad={this.handleLoad} src={this.props.src} />
        </div>;

        return(view);
    }
}

ImageViewer.propTypes = {
    src: React.PropTypes.string.isRequired
};

export default  ImageViewer;