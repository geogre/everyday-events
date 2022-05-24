import React from 'react';
import './NewEvent.scss';
import '../EventForm/EventForm.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventsApi from "../../../api/EventsApi";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import slugify from "slugify";
import {useNavigate, useParams} from "react-router";
import EventForm from "../EventForm/EventForm";

function NewEvent (props) {

    const params = useParams();
    const navigate = useNavigate();

    const addEventHandler = (formData) => {
        formData.id = formData.date + "-" + slugify(formData.title);
        console.log(formData);
        EventsApi.addEvent(formData).then(response => {
            console.log('Success');
            navigate('/');
        }).catch(error => {
            console.log(['error', error]);
        })
    }

    const cancelHandler = () => {
        navigate(-1);
    }

    return (
        <div>
            <div className={"events-header-container"}>
                <h2 className={"events-header"}>Add Event</h2>
            </div>
            <EventForm date={params.currentDate} onSubmit={addEventHandler} onCancel={cancelHandler} submitBtnCaption={"Add"} />
        </div>
    );

}

const mapDispatchToProps = dispatch => {
    return {
        onAddEvent: (newEvent) => dispatch(actionCreators.addEvent(newEvent))
    }
};

export default connect(null, mapDispatchToProps)(NewEvent);
