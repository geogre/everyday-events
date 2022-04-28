import React from 'react';
import './DateDecorated.scss';
import PropTypes from 'prop-types';
import Moment from 'moment';

const DateDecorated = (props ) =>  {
    return (
        <div className={"decorated-date"}>
            <span className={"decorated-date-day"}>{props.date.date()}</span>&nbsp;
            <span className={"decorated-date-month"}>{props.date.format('MMMM')}</span>&nbsp;
            <span className={"decorated-date-year"}>{props.date.year()}</span>
        </div>
    );
}

DateDecorated.propTypes = {
    date: PropTypes.instanceOf(Moment)
}

export default DateDecorated;
