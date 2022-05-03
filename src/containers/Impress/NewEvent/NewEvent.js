import React, {useEffect, useState} from 'react';
import './NewEvent.scss';
import '../EventForm/EventForm.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Input from "../../../components/Input/Input";
import eventForm from "../../../forms/event-form";
import EventsApi from "../../../api/EventsApi";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import moment from "moment";
import slugify from "slugify";
import { Navigate } from "react-router-dom";
import {useParams} from "react-router";

function NewEvent (props) {

    const dateChangeHandler = (currentDate) => {
        const theDate = moment(currentDate);
        const updatedForm = {
            ...state.form
        };
        const updatedFormElement = {
            ...updatedForm['date']
        };
        updatedFormElement.value = theDate.format('YYYY-MM-DD');
        updatedForm['date'] = updatedFormElement;
        setState({form: updatedForm});
    }

    const [state, setState] = useState({form: eventForm});
    const params = useParams();
    useEffect(() => {
        if (params.currentDate) {
            dateChangeHandler(params.currentDate);
        }
    }, [params.currentDate]);



    const inputChangedHandler = (event) => {
        const updatedForm = {
            ...state.form
        };
        const updatedFormElement = {
            ...updatedForm[event.target.name]
        };
        updatedFormElement.touched = true;
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedForm[event.target.name] = updatedFormElement;
        setState({form: updatedForm});
    }

    const checkValidity = (value, rules) => {
        let isValid = false;

        if (rules.required) {
            isValid = value.trim() !== '';
        } else {
            return true;
        }

        return isValid;
    }

    const addEventHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in state.form) {
            formData[formElementIdentifier] = state.form[formElementIdentifier].value;
        }
        formData['id'] = formData['date'] + "-" + slugify(formData['title']);
        EventsApi.addEvent(formData).then(response => {
            setState({form: null});
            props.onAddEvent(formData);
        }).catch(error => {
            //TODO catch
        })
    }

    const cancelHandler = () => {
        // TODO: replace this.props.history.goBack();
    }


    const formElementsArray = [];
    for (let key in state.form) {
        formElementsArray.push({
            id: key,
            config: state.form[key]
        });
    }

    if(state.form)
    return (
        <div>
            <div className={"events-header-container"}>
                <h2 className={"events-header"}>Add Event</h2>
            </div>
            <form className="EventForm" onSubmit={addEventHandler}>
                <div>
                    {formElementsArray.map(formElement => (
                        <Input
                            changed={formElement.id === 'date' ? dateChangeHandler : inputChangedHandler}
                            key={formElement.id}
                            invalid={!formElement.config.valid}
                            touched={formElement.config.touched}
                            label={formElement.config.label}
                            elementType={formElement.config.elementType}
                            elementConfig={{name: formElement.id, ...formElement.config.elementConfig}}
                            value={formElement.config.value} />
                    ))}
                    <div className={"buttons-block"}>
                        <button className={"button button-action"}>Add</button>
                        <button type={"button"} onClick={cancelHandler} className={"button"}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
    return <Navigate to="/" />;
}

const mapDispatchToProps = dispatch => {
    return {
        onAddEvent: (newEvent) => dispatch(actionCreators.addEvent(newEvent))
    }
};

export default connect(null, mapDispatchToProps)(NewEvent);
