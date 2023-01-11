import React, {useEffect, useState} from 'react';
import "./EventsByMonth.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";

function EventsByMonth(props) {
    const { userId, year } = useParams();
    const [months, setMonths] = useState([]);
    let content = "";

    useEffect(() => {
        console.log('componentdidmount');
        if ( userId && year ) {
            AllEventsApi.getByMonths(userId, year).then(response => {
                console.log(response.data);
                setMonths(response.data.rows);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year]);

    if (months.length > 0) {
        content = months.map(monthInfo => {
            return (
                <Link to={monthInfo.eventsMonth.toString()} key={monthInfo.eventsMonth}>
                    &nbsp;{monthInfo.eventsMonth}&nbsp;
                </Link>
            )
        });
    }

    return <div>{content}</div>;
}

export default EventsByMonth;
