/**
 * @file Exports PDF View Element
 * @author Bhanuka Mallawaarachchi
 */
import React, {Component} from 'react';
import axios from 'axios';
import PdfRender from '../PdfRender/index';
import typecast from 'typecast';

import './pdf-view.scss';
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

let View = (props)=> {
  let display = null;
  if (props.type === 'application/pdf') {
    display = <PdfRender file={props.blob}/>;
  } else if (typecast(props.type, 'string').indexOf('image/') > -1) {
    display = <div className={'PDFModal__view'}> <img src={props.url}/> </div>;
  } else {
    display = <p>Preview is not available for this document<br/> Please download to view</p>;
  }

  return display;
};

export default class MonthPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: props.file,
      blob: null,
      type: null
    }
  }

  componentDidMount() {
    let fileUrl = axios.get(this.state.fileUrl, {
      responseType: 'blob'
    });
    fileUrl.then((res)=> {
      this.setState({
        blob: res.data,
        type: res.data.type
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.blob ? <View blob={this.state.blob} url={this.state.fileUrl} type={this.state.type}/> : loading}
      </div>
    );
  }
}