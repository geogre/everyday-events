import React from 'react';
import Eevent from '../Event/Eevent';
import './Day.css';
import {Link} from "react-router-dom";

const day = (props ) =>  {
    let events = "";
    if (props.items.length > 0) {
        events = props.items.map(eevent => {
            return (
                <Link className={"single-event"} to={'/my-events/' + eevent.id} key={eevent.id}>
                    <Eevent data={eevent} />
                </Link>
            )
        });
    }

    return (
        <div className="day">
            <div className={"day-caption"}>
                <div className="day-title">{props.caption.dateName}</div>
                <div className="day-num">{props.caption.dateNum}</div>
            </div>
            { events }
            <Link to={'/my-events/new/' + props.dayKey}>
                <div className={"add-event"}></div>
            </Link>
        </div>
    );
}

export default day;