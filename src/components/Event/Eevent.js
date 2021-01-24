import React from 'react';
import './Eevent.scss';

const eevent = (props ) =>  (
        <div className="event" onClick={props.clicked}>
            <span className="event-title">{props.data.name}</span>
        </div>
);

export default eevent;