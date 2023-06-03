import React from 'react';
import './EventItem.scss';

function EventItem(props) {
	const {item} = props;
	return <div className={'EventItem DiaryItem'}>
		<div className={'Header'}>{item.eventName}</div>
		<div className={'ImagesCount'}><p>&#128444;&nbsp;{item.imagesCount}</p></div>
	</div>;
}

export default EventItem;
