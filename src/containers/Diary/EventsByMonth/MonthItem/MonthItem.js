import React, {Fragment} from 'react';
import './MonthItem.scss';
import {getMonthName} from "../../../../tools/formatter";

function MonthItem(props) {
	const {item, monthNumber} = props;
	return <div className={'MonthItem DiaryItem'}>
		<div className={'Header'}>{getMonthName(window.navigator.language, monthNumber)}</div>
		{ item !== null ?
			<Fragment>
				<div className={'EventsCount'}>&#128450;&nbsp;{item.eventsCount}</div>
				<div className={'ImagesCount'}>&#128444;&nbsp;{item.imagesCount}</div>
			</Fragment> : ''
		}
	</div>;
}

export default MonthItem;
