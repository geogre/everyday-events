import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Impress.scss';
import Eevents from './Eevents/Eevents';
import NewEvent from "./NewEvent/NewEvent";
import FullEvent from "./FullEvent/FullEvent";
import UpdateEvent from "./UpdateEvent/UpdateEvent";
import EventsByYear from "./EventsByYear/EventsByYear";
import EventsByMonth from "./EventsByMonth/EventsByMonth";
import EventsByDay from "./EventsByDay/EventsByDay";
import EventsForDay from "./EventsForDay/EventsForDay";

const Impress = () =>  {

    const loggedInRoutes =
        (<Routes>
            <Route path="/" exact element={<Eevents />} />
            <Route path="/my-events/new" element={<NewEvent />} />
            <Route path="/my-events/new/:currentDate" element={<NewEvent />} />
            <Route path="/my-events/update/:eventId" element={<UpdateEvent />} />
            <Route path="/my-events/:eventId" strict element={<FullEvent />} />
            <Route path="/:userId" strict element={<EventsByYear />} />
            <Route path="/:userId/:year" strict element={<EventsByMonth />} />
            <Route path="/:userId/:year/:month" strict element={<EventsByDay />} />
            <Route path="/:userId/:year/:month/:day" strict element={<EventsForDay />} />
        </Routes>);

    return (
        <div className={'AppContent'}>
            {loggedInRoutes}
        </div>
    );
}

export default Impress;
