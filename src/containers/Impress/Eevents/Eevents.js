import React, {Component} from 'react';
import Day from "../../../components/Day/Day";
import DayCaption from "../../../components/Day/DayCaption";
import './Eevents.scss';
import {Link} from "react-router-dom";
import EventsApi from "../../../api/EventsApi";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import {getDatesInfo} from "../../../store/selectors/dates-selector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getSortedEvents} from "../../../store/selectors/events-selector";
import {SHORT_DATE} from "../../../tools/formatter";

class EverydayEvents extends Component
{
    componentDidMount () {
        EventsApi.getEvents(this.props.dateInfo.startDate, this.props.dateInfo.endDate).then(response => {
            this.props.onGetEvents(response.data.events);
        } ).catch(error => {
            //TODO catch
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentDate !== prevProps.currentDate) {
            EventsApi.getEvents(this.props.dateInfo.startDate, this.props.dateInfo.endDate).then(response => {
                this.props.onGetEvents(response.data.events);
            } ).catch(error => {
                //TODO catch
            });
        }
    }

    render()
    {
        let allDates = {
            captions: [],
            days: []
        };
        this.props.dateInfo.datesRange.forEach(day => {
            allDates.days.push(<Day
                current={day.isCurrent}
                key={day.key}
                dayKey={day.key}
                items={this.props.eventsByDate[day.key] || []}
            />);
            allDates.captions.push(<DayCaption
                key={day.key}
                onClick = {()=>{this.props.onSetDate(day.key)}}
                current={day.isCurrent}
                caption={day.caption}
            />)
        });

        return (
            <div>
                <div className={"events-header-container"}>
                    <h2 className={"events-header"}>Events Calendar</h2>
                </div>
                <div className={"date-info"}>
                    <div className={"current-week"}>
                        <button className={"date-arrow date-arrow-left"} onClick={()=>{this.props.onSetDate(this.props.dateInfo.previousDate)}}></button>
                        <input readOnly className={"week-dates"} type="text" value={this.props.dateInfo.startDate.format(SHORT_DATE) + " - " + this.props.dateInfo.endDate.format(SHORT_DATE)} />
                        <button className={"date-arrow date-arrow-right"} onClick={()=>{this.props.onSetDate(this.props.dateInfo.nextDate)}}></button>
                    </div>
                    <div className={"current-day"}>
                        <Link className={"add-btn"} to={'/my-events/new'}></Link>
                        <DatePicker selected={this.props.dateInfo.currentDate} onChange={date => {this.props.onSetDate(date)}} />
                    </div>
                </div>
                <section className="captions">
                    { allDates.captions }
                </section>
                <section className="events">
                    { allDates.days }
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        eventsByDate: getSortedEvents(state.eventsData.events),
        currentDate: state.datesData.currentDate,
        dateInfo: getDatesInfo(state.datesData.currentDate)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetEvents: (events) => dispatch(actionCreators.getEvents(events)),
        onSetDate: (currentDate) => dispatch(actionCreators.getDate(currentDate))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EverydayEvents);
