import React, {useEffect, useState} from 'react';
import "./EventsForDay.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";

function EventsForDay(props) {
    const { userId, year, month, day } = useParams();
    const [dayEvents, setDayEvents] = useState([]);
    let content = "";

    useEffect(() => {
        console.log('componentdidmount');
        if ( userId && year ) {
            AllEventsApi.getDay(userId, year, month, day).then(response => {
                console.log(response.data);
                setDayEvents(response.data.rows);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year, month]);

    if (dayEvents.length > 0) {
        content = dayEvents.map(dayInfo => {
            return (
                <Link to={dayInfo.eventPath} key={dayInfo.eventName}>
                    &nbsp;{dayInfo.eventName}&nbsp;
                </Link>
            )
        });
    }

    return <div>{content}</div>;
}

export default EventsForDay;
