import React, {Fragment, useEffect, useState} from 'react';

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
import YouTubeWidget from "../../../components/YouTube/YouTubeWidget";
import {getAlbumPath, youtubeParser} from "../../../tools/formatter";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function FullEvent(props) {

    const navigate = useNavigate();
    const { eventId } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const onGetEvent = props.onGetEvent;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        const youtubeCode = youtubeParser(youtubeUrl);
        if (youtubeCode) {
            const currentVideo = props.currentEvent.video;
            let videos = [];
            if (currentVideo) {
                videos = currentVideo.split(',');
            }
            videos.push(youtubeCode);
            const updatedEvent = {
                ...props.currentEvent,
                video: videos.join(',')
            };
            EventsApi.updateEvent(updatedEvent).then(response => {
                window.location.reload();
            }).catch(error => {
                //TODO catch
            })
        } else {
            alert('Incorrect url');
        }
        setOpen(false);
    };

    const deleteVideo = (video) => {
        if (video) {
            const currentVideo = props.currentEvent.video;
            let videos = [];
            if (currentVideo) {
                videos = currentVideo.split(',');
            }
            const newVideos = videos.filter(v => v !== video)
            const updatedEvent = {
                ...props.currentEvent,
                video: newVideos.join(',')
            };
            EventsApi.updateEvent(updatedEvent).then(response => {
                window.location.reload();
            }).catch(error => {
                //TODO catch
            })
        } else {
            alert('Incorrect input');
        }
    };

    const handleYoutubeUrlChange = (event) => {
        setYoutubeUrl(event.target.value);
    };

    useEffect(() => {
        console.log('componentdidmount');
        if ( eventId ) {
            EventsApi.getEvent(eventId).then(response => {
                onGetEvent(response.data.event);
            } ).catch(error => {
                //TODO catch
            });
        }
        return () => {
            console.log('DESCTRUCTOR FULL EVENT');
        }
    }, [eventId, onGetEvent]);

    useEffect(() => {
        if (props.currentEvent && eventId === props.currentEvent.id) {
            setIsLoaded(true);
        }
    }, [props.currentEvent, eventId]);

    const deleteDataHandler = () => {
        EventsApi.deleteEvent(props.currentEvent.id).then(response => {
            setIsDeleted(true);
        }).catch(error => {
            //TODO catch
        })
    }

    const cancelHandler = () => {
        navigate('/');
    }

    let eevent = <p style={{ textAlign: 'center' }}>Loading...</p>;
    if(isDeleted) {
        eevent = <Navigate to="/" />;
    } else if ( props.currentEvent && isLoaded) {
        eevent = (
            <div className={"event-block"}>
                <div className={"details-block"}>
                    <DateDecorated date={moment(props.currentEvent.date)} />
                    <div className={"event-title-block"}>
                        <p className="event-title">{props.currentEvent.title}</p>
                        <div className={"buttons-block"}>
                            <img alt={"Add youtube"} src={"/youtube.png"} onClick={handleClickOpen}></img>
                            <Link to={'/my-events/update/' + props.currentEvent.id}>
                                <img src={"/edit.png"} alt={"Edit event"} />
                            </Link>
                            <img alt={"Delete"} src={"/trash.png"} onClick={deleteDataHandler}></img>
                            <img alt={"Back"} src={"/back.png"} onClick={cancelHandler}></img>
                        </div>
                    </div>
                    {props.currentEvent.description && <p className="event-description">{props.currentEvent.description}</p>}
                </div>
                <div className={"album-block"} >
                    <Album eventIsLoaded={isLoaded} path={getAlbumPath(props.currentEvent)} />
                </div>
                {props.currentEvent.video && <div>
                    {props.currentEvent.video.split(',').map(video => {
                        return <div className={"video"}>
                            <YouTubeWidget key={video} embedId={video} />
                            <img alt={"Delete"} src={"/delete.png"} onClick={()=> {
                                deleteVideo(video);
                            }}></img>
                        </div>
                    })}
                </div>}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Youtube Video</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please add youtube URL of your video
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="youtubevideo"
                            label="Youtube URL"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleYoutubeUrlChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Add</Button>
                    </DialogActions>
                </Dialog>
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
