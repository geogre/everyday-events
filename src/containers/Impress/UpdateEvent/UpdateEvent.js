import React, {useEffect} from 'react';
import './UpdateEvent.scss';
import '../EventForm/EventForm.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventsApi from "../../../api/EventsApi";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import { useParams } from "react-router-dom";
import EventForm from "../EventForm/EventForm";
import {useNavigate} from "react-router";

function UpdateEvent(props) {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const {onUpdateEvent, onGetEvent, currentEvent} = props;

    useEffect(() => {
        console.log('updateevent');
        if ( eventId ) {
            EventsApi.getEvent(eventId).then(response => {
                console.log(response.data);
                onGetEvent(response.data.event);
            } ).catch(error => {
                //TODO catch
            });
        }
    }, [eventId, onGetEvent]);

    const updateDataHandler = (formData) => {
        EventsApi.updateEvent(formData).then(response => {
            onUpdateEvent(formData);
            navigate(-1);
            //console.log(response);
        }).catch(error => {
            //TODO catch
        })
    }

    const cancelHandler = () => {
        navigate(-1);
    }

    let eevent = <p style={{ textAlign: 'center' }}>Loading...</p>;
    if ( currentEvent ) {
        eevent = (
            <div>
                <div className={"events-header-container"}>
                    <h2 className={"events-header"}>Update Impression</h2>
                </div>
                <EventForm {...currentEvent} onSubmit={updateDataHandler} onCancel={cancelHandler} />
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
        onUpdateEvent: (currentEvent) => dispatch(actionCreators.updateEvent(currentEvent))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEvent);
