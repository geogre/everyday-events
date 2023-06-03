import React, {useEffect, useState} from 'react';
import "./EventsByYear.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";
import DiaryWrapper from "../DiaryWrapper";
import YearItem from "./YearItem/YearItem";

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
                <Link className={"DiaryItemWrapper"} to={yearInfo.eventsYear.toString()} key={yearInfo.eventsYear}>
                    <YearItem item={yearInfo} />
                </Link>
            )
        });
    }

    return <DiaryWrapper headerText={'Album'}>{content}</DiaryWrapper>;
}

export default EventsByYear;
