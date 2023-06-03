import React, {useEffect, useState} from 'react';
import "./EventsByMonth.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";
import MonthItem from "./MonthItem/MonthItem";
import DiaryWrapper from "../DiaryWrapper";

function EventsByMonth(props) {
    const { userId, year } = useParams();
    const [months, setMonths] = useState([]);
    let content = "";

    useEffect(() => {
        console.log('componentdidmount');
        if ( userId && year ) {
            AllEventsApi.getByMonths(userId, year).then(response => {
                let allMonths = new Array(13).fill(null);
                response.data.rows.forEach(month => {
                    allMonths[month.eventsMonth] = month;
                });
                setMonths(allMonths);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year]);

    if (months.length > 0) {
        content = months.map((monthInfo, index) => {
            return (
                index > 0 ?
                <Link className={"DiaryItemWrapper MonthItemWrapper " + (monthInfo === null ? ' Empty' : '')}  to={index.toString()} key={index}>
                    <MonthItem item={monthInfo} monthNumber={index} />
                </Link> : ''
            )
        });
    }

    return <DiaryWrapper headerText={year}>{content}</DiaryWrapper>;
}

export default EventsByMonth;
