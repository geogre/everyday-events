import React, {useEffect, useState} from 'react';
import "./SingleEvent.scss";
import {useParams} from "react-router-dom";
import EventsApi from "../../../api/EventsApi";
import {getAlbumPath} from "../../../tools/formatter";
import DiaryWrapper from "../DiaryWrapper";
import Gallery from "../../../components/Gallery/Gallery";

function SingleEvent(props) {
    const { userId, eventId } = useParams();
    const [currentEvent, setCurrentEvent] = useState([]);
    let content = "Single Event";

    useEffect(() => {
        console.log('componentdidmount single event');
        if ( userId && eventId) {
            EventsApi.getUserEvent(userId, eventId).then(response => {
                setCurrentEvent(response.data.event);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [userId, eventId]);

    if (currentEvent) {
        content = <div>
            <div className={"album-block"} >
                <Gallery path={getAlbumPath(currentEvent)} />
            </div>
        </div>;
    }

    return <DiaryWrapper className={'EventsByDay'} headerText={currentEvent.title}>{content}</DiaryWrapper>
}

export default SingleEvent;
