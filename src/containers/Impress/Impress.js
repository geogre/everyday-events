import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Impress.scss';
import Eevents from './Eevents/Eevents';
import NewEvent from "./NewEvent/NewEvent";
import FullEvent from "./FullEvent/FullEvent";
import UserEvent from "./UserEvent/UserEvent";
import UpdateEvent from "./UpdateEvent/UpdateEvent";

const Impress = () =>  {

    const loggedInRoutes =
        (<Routes>
            <Route path="/" exact element={<Eevents />} />
            <Route path="/my-events/new/:currentDate?" element={<NewEvent />} />
            <Route path="/my-events/update/:eventId" element={<UpdateEvent />} />
            <Route path="/my-events/:eventId" strict element={<FullEvent />} />
        </Routes>);

    const loggedOutRoutes =
        (<Routes>
            <Route path="/:userId/:eventId" element={<UserEvent />} />
        </Routes>);

    return (
        <div className={'AppContent'}>
            {loggedInRoutes}
        </div>
    );
}

export default Impress;
