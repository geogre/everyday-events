import React from 'react';
import DatePicker from 'react-date-picker';
import './Input.scss';

const input = ( props ) => {
    let inputElement = null;
    const inputClasses = ["InputElement"];

    if(props.invalid && props.touched) {
        inputClasses.push("Invalid");
    }

    switch(props.elementType) {
        case ( 'input' ):
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'textarea' ):
            inputElement = <textarea
                className={inputClasses.concat('TextArea').join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'select' ):
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={date => props.changed(date)}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        case ( 'datepicker' ):
            inputElement = (
                <DatePicker
                    format="yyyy-MM-dd"
                    className={"form-control Input"}
                    onChange={date => props.changed(date)}
                    value={props.value === '' ? new Date() : new Date(props.value)}
                />
            );
            break;
        case ( 'hidden' ):
            inputElement = (
                <input type={"hidden"}
                    value={props.value} />
            );
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
    }

    return (
        <div className={`form-group Input ${props.elementType === 'hidden' ? "hidden" : ""}`}>
            <label className={`Label`}>{props.label}</label>
            {inputElement}
        </div>
    )
}

export default input;
