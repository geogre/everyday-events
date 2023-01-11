import React, {useEffect, useState} from 'react';
import "./EventsByYear.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";

function EventsByYear(props) {
    const { userId } = useParams();
    const [years, setYears] = useState([]);
    let content = "";

    useEffect(() => {
        console.log('componentdidmount');
        if ( userId ) {
            AllEventsApi.getByYears(userId).then(response => {
                console.log(response.data);
                setYears(response.data.rows);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId]);

    if (years.length > 0) {
        content = years.map(yearInfo => {
            return (
                <Link to={yearInfo.eventsYear.toString()} key={yearInfo.eventsYear}>
                    &nbsp;{yearInfo.eventsYear}&nbsp;
                </Link>
            )
        });
    }

    return <div>{content}</div>;
}

export default EventsByYear;
