import React from 'react';
import {Route, Switch} from 'react-router-dom';
import './Impress.scss';
import Eevents from './Eevents/Eevents';
import NewEvent from "./NewEvent/NewEvent";
import FullEvent from "./FullEvent/FullEvent";
import UserEvent from "./UserEvent/UserEvent";
import UpdateEvent from "./UpdateEvent/UpdateEvent";

const impress = (props ) =>  {

    const loggedInRoutes =
        <Switch>
            <Route path="/" exact component={Eevents} />
            <Route path="/my-events/new/:currentDate?" component={NewEvent} />
            <Route path="/my-events/update/:eventId" component={UpdateEvent} />
            <Route path="/my-events/:eventId" strict component={FullEvent} />
        </Switch>;

    const loggedOutRoutes =
        <Switch>
            <Route path="/:userId/:eventId" component={UserEvent} />
        </Switch>;

    const actualRoutes = props.authState === 'signedIn' || true ? loggedInRoutes : loggedOutRoutes;

    return (
        <div className={'AppContent'}>
            {actualRoutes}
        </div>
    );
}

export default impress;
