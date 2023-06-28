import React, {Fragment} from 'react';
import './DayItem.scss';
import {DAY_NUMBER} from "../../../../tools/formatter";

function DayItem(props) {
	const {item, itemDate} = props;
	return <div className={'DayItem DiaryItem'}>
		<div className={'Header'}>{itemDate.format(DAY_NUMBER)}</div>
		{ item !== null ?
			<Fragment>
				<div className={'EventsCount'}>&#128450;&nbsp;{item.eventsCount}</div>
				<div className={'ImagesCount'}>&#128444;&nbsp;{item.imagesCount}</div>
			</Fragment> : "" }
	</div>;
}

export default DayItem;
