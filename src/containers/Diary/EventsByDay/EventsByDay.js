import React, {useEffect, useState} from 'react';
import "./EventsByDay.scss";
import {Link, useParams} from "react-router-dom";
import AllEventsApi from "../../../api/AllEventsApi";
import {FULL_DATE, getCalendarMonth, getMonthName} from "../../../tools/formatter";
import moment from "moment";
import DayItem from "./DayItem/DayItem";
import DiaryWrapper from "../DiaryWrapper";
import {DAY_NAME} from "../../../tools/formatter";

function EventsByDay(props) {
    const { userId, year, month } = useParams();
    const [days, setDays] = useState([]);
    let content = "";
    const calendarHeader = [...Array(7).keys()].map(d =>
        <div className={"DiaryItemWrapper DayItemWrapper DayItemHeader"}>{moment().day(d).format(DAY_NAME)}</div>
    );

    useEffect(() => {
        console.log('componentdidmount events by day');
        if ( userId && year && month) {
            let allDays = getCalendarMonth(year, month);
            allDays = allDays.map(day => {return {'dayDate': day, 'dayInfo': null}});
            AllEventsApi.getByDays(userId, year, month).then(response => {
                console.log(response.data);
                response.data.rows.forEach(row => {
                   let key = moment(year + '-' + month + '-' + row.eventsDay).format(FULL_DATE);
                   let index = allDays.findIndex(object => object.dayDate.format(FULL_DATE) === key);
                   if(index > -1) {
                       allDays[index].dayInfo = row;
                   } else {
                       console.log('Cannot find index!', key, allDays);
                   }
                   allDays[key] = row;
                });
                setDays(allDays);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, year, month]);

    if (days.length > 0) {
        content = days.map((dayObject, index) => {
            return (
                <Link  className={"DiaryItemWrapper DayItemWrapper " + (dayObject.dayInfo === null ? ' Empty' : '')} to={dayObject.dayDate.date().toString()} key={index}>
                    <DayItem item={dayObject.dayInfo} itemDate={dayObject.dayDate}></DayItem>
                </Link>
            )
        });
    }

    return <DiaryWrapper headerText={`${year}, ${getMonthName(window.navigator.language, month)}`}>{calendarHeader}{content}</DiaryWrapper>;
}

export default EventsByDay;
