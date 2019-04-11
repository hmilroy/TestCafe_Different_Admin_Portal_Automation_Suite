import React from 'react';
import {AutoComplete} from 'material-ui';

const SearchEmailInput = (props) => {
    let inputClass = props.inputClass ? props.inputClass : '';
    let edit = props.edit ? props.edit : true;
    inputClass += props.invalid ? ' invalid' : '';
    let menuProps = props.menuProps || {};

    const inputDisplay = edit ?
        <AutoComplete className=""
                      listStyle={{maxHeight: 200, overflow: 'auto'}}
                      searchText={props.inputValue}
                      name="Search-Input"
                      floatingLabelText={props.placeholder}
                      filter={AutoComplete.noFilter}
                      openOnFocus={true}
                      dataSource={props.dataSource}
                      onUpdateInput={props.onUpdateInput}
                      onNewRequest={props.onNewRequest}
                      fullWidth={true}
                      disabled={props.disable}
                      menuProps={menuProps}
					  hintText={props.hintText ? props.hintText : ''}
                      required/>
        : <p> {props.inputValue} </p>;
    return (
        <div className="form-group row element">
            <label className="form-label col-xs-3">{props.title}</label>
            <div className={"no-padding col-xs-9 search-input " + inputClass}>
                {inputDisplay}
                {props.invalid && <div className="email-validation__message">
                    {props.validationMessage}
                </div>}
                 {props.notFoundInput && props.displayNotFound && 
                    <div className="search-input__notfound">
                   {props.notFoundInput} 
                    </div>
                }
            </div>
        </div>
    );
};

SearchEmailInput.propTypes = {
    title: React.PropTypes.string.isRequired,
    dataSource: React.PropTypes.array.isRequired,
    onUpdateInput: React.PropTypes.func.isRequired,
    onNewRequest: React.PropTypes.func.isRequired,
    inputValue: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    placeholder: React.PropTypes.string,
    disable: React.PropTypes.bool
};

export default SearchEmailInput;