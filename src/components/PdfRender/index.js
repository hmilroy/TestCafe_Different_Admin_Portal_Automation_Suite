import React, {Component} from 'react';
import PDF from 'react-pdf-js';
import './pdf-render.scss';

export default class PdfRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      page: 1
    };
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.renderPagination = this.handleNext.bind(this);
  }

  onDocumentComplete(pages) {
    this.setState({page: 1,
      pages});
  }

  onPageComplete(page) {
    this.setState({page});
  }

  handlePrevious() {
    this.setState({page: this.state.page - 1});
  }

  handleNext() {
    this.setState({page: this.state.page + 1});
  }

  render() {
    let page = this.state.page;
    let pages = this.state.pages;
    let previousButton = <button className="PDFModal__button" onClick={this.handlePrevious} >Previous</button>;
    if (page === 1) {
      previousButton = <button className="PDFModal__button PDFModal__button--disabled" disabled >Previous</button>;
    }
    let nextButton = <button className="PDFModal__button" onClick={this.handleNext} >Next</button>;
    if (page === pages) {
      nextButton = <button className="PDFModal__button PDFModal__button--disabled" disabled >Next</button>;
    }
    let pagination = (
      <nav className={'PDFModal__pagination'}>
        {previousButton}
        {nextButton}
      </nav>
    );

    return (
      <div>
        <div className={'PDFModal__view'} >
          <PDF file={this.state.file} onDocumentComplete={this.onDocumentComplete} page={this.state.page}/>
        </div>
        {(this.state.pages > 1) && pagination}
      </div>
    );
  }
}
