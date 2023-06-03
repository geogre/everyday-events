import React from 'react';
import './YearItem.scss';

function YearItem(props) {
	const {item} = props;
	return <div className={'YearItem DiaryItem'}>
		<div className={'Header'}>{item.eventsYear}</div>
		<div className={'EventsCount'}>&#128450;&nbsp;{item.eventsCount}</div>
		<div className={'ImagesCount'}>&#128444;&nbsp;{item.imagesCount}</div>
	</div>;
}

export default YearItem;
