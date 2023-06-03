import React, {Fragment} from 'react';
import { Route, Routes } from 'react-router-dom';
import EventsByYear from "./EventsByYear/EventsByYear";
import EventsByMonth from "./EventsByMonth/EventsByMonth";
import EventsByDay from "./EventsByDay/EventsByDay";
import EventsForDay from "./EventsForDay/EventsForDay";
import Home from "./Home/Home";
import SingleEvent from "./SingleEvent/SingleEvent";

const Diary = () =>  {
	const diaryRoutes =
		(<Routes>
			<Route path="/" exact element={<Home />} />
			<Route path="/:userId" strict element={<EventsByYear />} />
			<Route path="/:userId/events/:eventId" strict element={<SingleEvent />} />
			<Route path="/:userId/:year" strict element={<EventsByMonth />} />
			<Route path="/:userId/:year/:month" strict element={<EventsByDay />} />
			<Route path="/:userId/:year/:month/:day" strict element={<EventsForDay />} />
		</Routes>);

	return (
		<Fragment>
			{diaryRoutes}
		</Fragment>
	);
}

export default Diary;
