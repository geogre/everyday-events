import React, { Component } from 'react';

import './FullEvent.scss';
import EventsApi from "../../../api/EventsApi";
import {Link} from "react-router-dom";
import * as actionCreators from "../../../store/actions/actions";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {S3Album} from "aws-amplify-react";
import {Storage} from "aws-amplify";
import FullEventTheme from "./FullEventTheme";
import DateDecorated from "../../../components/DateDecorated/DateDecorated";
import moment from 'moment';

class FullEvent extends Component {

    constructor(props) {
        super(props);
        this.album = React.createRef();
    }

    state = {
        deleted: false,
        hasSelectedImages: false
    }

    componentDidMount () {
        if ( this.props.match.params.eventId ) {
            EventsApi.getEvent(this.props.match.params.eventId).then(response => {
                this.props.onGetEvent(response.data.event);
            } ).catch(error => {
                //TODO catch
            });
        }
    }

    deleteDataHandler = () => {
        EventsApi.deleteEvent(this.props.currentEvent.id).then(
            () => {
                return Promise.all(this.album.current.state.items.map(item => {
                    return Storage.remove(item.key, {  })
                        .then(() => item.key)
                        .catch(error => error);
                }));
            }
        ).then(response => {
            this.setState({deleted: true});
        }).catch(error => {
            //TODO catch
        })
    }

    getAlbumPath = () => {
        console.log(this.props.currentEvent.userId + '/' + this.props.currentEvent.date + '/' + this.props.currentEvent.id);
        return this.props.currentEvent.userId + '/' + this.props.currentEvent.date + '/' + this.props.currentEvent.id;
    }

    onSelectHandler = () => {
        const hasSelectedItems = (() => {
            for(let i=0; i<this.album.current.state.items.length; i++) {
                if (this.album.current.state.items[i].selected) {
                    return true;
                }
            }
            return false;
        })();
        this.setState({hasSelectedImages: hasSelectedItems});
    }

    cancelHandler = () => {
        this.props.history.goBack();
    }

    deleteImagesHandler = () => {
        Promise.all(this.album.current.state.items.map(item => {
            if(item.selected) {
                return Storage.remove(item.key, {  })
                    .then(() => item.key)
                    .catch(error => error);
            }
            return Promise.resolve();
        }))
        .then(deletedItems => {
            const filteredItems = this.album.current.state.items.filter(item => {
                return !deletedItems.includes(item.key);
            });
            this.album.current.setState({
                items: filteredItems,
                ts: new Date().getTime()
            });
        })
    }

    render () {
        let eevent = <p style={{ textAlign: 'center' }}>Loading...</p>;
        if(this.state.deleted) {
            eevent = <Redirect to="/"></Redirect>;
        } else if ( this.props.currentEvent ) {
            eevent = (
                <div className={"event-block"}>
                    <div className={"details-block"}>
                        <DateDecorated date={moment(this.props.currentEvent.date)} />
                        <p className="event-title">{this.props.currentEvent.title}</p>
                        <p className="event-description">{this.props.currentEvent.description}</p>
                        <div className={"buttons-block"}>
                            <Link className="button button-action" to={'/my-events/update/' + this.props.currentEvent.id}>
                                Update
                            </Link>
                            <button onClick={this.deleteDataHandler} className="button button-action">Delete</button>
                            <button onClick={this.cancelHandler} className={"button"}>Cancel</button>
                        </div>
                    </div>
                    <div className={"album-block"} >
                        <S3Album ref={this.album} path={this.getAlbumPath()} pickerTitle={'Add new image'} picker select theme={FullEventTheme}  onSelect={this.onSelectHandler}/>
                        <div className={"buttons-block"}>
                            <button onClick={this.deleteImagesHandler} className={`button ${this.state.hasSelectedImages ? "button-success" : "hide"}`}>Delete Selected</button>

                        </div>
                    </div>
                </div>

            );
        }
        return eevent;
    }
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
