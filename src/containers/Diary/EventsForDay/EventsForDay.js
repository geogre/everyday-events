import React, {useEffect, useState} from 'react';
import "./EventsForDay.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";
import EventItem from "./EventItem/EventItem";
import {DAY_FULL} from "../../../tools/formatter";
import DiaryWrapper from "../DiaryWrapper";
import moment from "moment/moment";

function EventsForDay(props) {
    const { userId, year, month, day } = useParams();
    const [dayEvents, setDayEvents] = useState([]);
    let content = "";
    let [dateCaption, setDateCaption] = useState('');

    useEffect(() => {
        if ( userId && year && month && day ) {
            AllEventsApi.getDay(userId, year, month, day).then(response => {
                setDateCaption(moment([year, month - 1, day]).format(DAY_FULL));
                console.log(response.data);
                setDayEvents(response.data.rows);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year, month, day]);

    if (dayEvents.length > 0) {
        content = dayEvents.map(dayInfo => {
            return (
                <Link to={'/' + userId + '/events/' + dayInfo.eventPath} key={dayInfo.eventName}>
                    <EventItem item={dayInfo} />
                </Link>
            )
        });
    }

    return <DiaryWrapper className={'EventsByDay'} headerText={dateCaption}>{content}</DiaryWrapper>;
}

export default EventsForDay;
