import React, {useEffect, useState} from 'react';
import "./EventsByDay.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";

function EventsByDay(props) {
    const { userId, year, month } = useParams();
    const [days, setDays] = useState([]);
    let content = "";

    useEffect(() => {
        console.log('componentdidmount');
        if ( userId && year ) {
            AllEventsApi.getByDays(userId, year, month).then(response => {
                console.log(response.data);
                setDays(response.data.rows);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year, month]);

    if (days.length > 0) {
        content = days.map(dayInfo => {
            return (
                <Link to={dayInfo.eventsDay.toString()} key={dayInfo.eventsDay}>
                    &nbsp;{dayInfo.eventsDay}&nbsp;
                </Link>
            )
        });
    }

    return <div>{content}</div>;
}

export default EventsByDay;
