import React, {useEffect, useState} from 'react';

import './FullEvent.scss';
import EventsApi from "../../../api/EventsApi";
import {Link} from "react-router-dom";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import {useParams, Navigate} from "react-router-dom";
import DateDecorated from "../../../components/DateDecorated/DateDecorated";
import moment from 'moment';
import {useNavigate} from "react-router";
import Album from "../../../components/Album/Album";
import {Image} from "@aws-amplify/ui-react";
import YouTubeWidget from "../../../components/YouTube/YouTubeWidget";

function FullEvent(props) {

    const navigate = useNavigate();
    const { eventId } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        console.log('componentdidmount');
        if ( eventId ) {
            EventsApi.getEvent(eventId).then(response => {
                props.onGetEvent(response.data.event);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, []);

    const deleteDataHandler = () => {
        EventsApi.deleteEvent(props.currentEvent.id).then(response => {
            setIsDeleted(true);
        }).catch(error => {
            //TODO catch
        })
    }

    const getAlbumPath = () => {
        return props.currentEvent.userId + '/' + props.currentEvent.date + '/' + props.currentEvent.id;
    }

    const cancelHandler = () => {
        navigate('/');
    }

    let eevent = <p style={{ textAlign: 'center' }}>Loading...</p>;
    if(isDeleted) {
        eevent = <Navigate to="/" />;
    } else if ( props.currentEvent ) {
        eevent = (
            <div className={"event-block"}>
                <div className={"details-block"}>
                    <DateDecorated date={moment(props.currentEvent.date)} />
                    <div className={"event-title-block"}>
                        <p className="event-title">{props.currentEvent.title}</p>
                        <div className={"buttons-block"}>
                            <Link to={'/my-events/update/' + props.currentEvent.id}>
                                <img src={"/edit.png"} alt={"Edit event"} />
                            </Link>
                            <img src={"/trash.png"} onClick={deleteDataHandler}></img>
                            <img src={"/back.png"} onClick={cancelHandler}></img>
                        </div>
                    </div>
                    {props.currentEvent.description && <p className="event-description">{props.currentEvent.description}</p>}
                </div>
                <div className={"album-block"} >
                    <Album path={getAlbumPath()} />
                </div>
                {props.currentEvent.video && <div>
                    {props.currentEvent.video.split(',').map(video => {
                        return <YouTubeWidget embedId={video} />
                    })}
                </div>}
            </div>
        );
    }

    return eevent;

}

const mapStateToProps = state => {
    return {
        currentEvent: state.eventsData.currentEvent
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetEvent: (currentEvent) => dispatch(actionCreators.getEvent(currentEvent)),
        onDeleteEvent: (eventId) => dispatch(actionCreators.deleteEvent(eventId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FullEvent);
