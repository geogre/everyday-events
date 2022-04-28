import React, {useEffect, useState} from 'react';

import './FullEvent.scss';
import EventsApi from "../../../api/EventsApi";
import {Link} from "react-router-dom";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import {useParams, Navigate} from "react-router-dom";
import {S3Album} from "aws-amplify-react";
import {Storage} from "aws-amplify";
import FullEventTheme from "./FullEventTheme";
import DateDecorated from "../../../components/DateDecorated/DateDecorated";
import moment from 'moment';
import {useNavigate} from "react-router";

function FullEvent(props) {

    const navigate = useNavigate();
    const album = React.createRef();
    const { eventId } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);
    const [hasSelectedImages, setHasSelectedImages] = useState(false);


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
        EventsApi.deleteEvent(props.currentEvent.id).then(
            () => {
                return Promise.all(album.current.state.items.map(item => {
                    return Storage.remove(item.key, {  })
                        .then(() => item.key)
                        .catch(error => error);
                }));
            }
        ).then(response => {
            setIsDeleted(true);
        }).catch(error => {
            //TODO catch
        })
    }

    const getAlbumPath = () => {
        return props.currentEvent.userId + '/' + props.currentEvent.date + '/' + props.currentEvent.id;
    }

    const onSelectHandler = () => {
        const hasSelectedItems = (() => {
            for(let i=0; i<album.current.state.items.length; i++) {
                if (album.current.state.items[i].selected) {
                    return true;
                }
            }
            return false;
        })();
        setHasSelectedImages(hasSelectedItems);
    }

    const cancelHandler = () => {
        navigate('/');
    }

    const deleteImagesHandler = () => {
        Promise.all(album.current.state.items.map(item => {
            if(item.selected) {
                return Storage.remove(item.key, {  })
                    .then(() => item.key)
                    .catch(error => error);
            }
            return Promise.resolve();
        }))
        .then(deletedItems => {
            const filteredItems = album.current.state.items.filter(item => {
                return !deletedItems.includes(item.key);
            });
            album.current.setState({
                items: filteredItems,
                ts: new Date().getTime()
            });
        })
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
                    <p className="event-description">{props.currentEvent.description}</p>
                </div>
                <div className={"album-block"} >
                    <S3Album ref={album} path={getAlbumPath()} pickerTitle={' '} picker select theme={FullEventTheme}  onSelect={onSelectHandler}/>
                    <div className={"buttons-block"}>
                        <img src={"/delete.png"} onClick={deleteImagesHandler} className={`${hasSelectedImages ? "" : "hide"}`}></img>
                    </div>
                </div>
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
