import moment from "moment";

export const SHORT_DATE = 'DD/MM';
export const FULL_DATE = 'YYYY-MM-DD';
export const DAY_NAME = 'ddd';
export const DAY_NUMBER = 'DD';
export const DAY_FULL = 'Do MMMM, YYYY';

export function getMonthName(lang, monthNumber) {
	const date = new Date();
	date.setMonth(monthNumber - 1);

	return date.toLocaleString(lang, { month: 'long' });
}

export function getCalendarMonth(year, month) {
	let allDates = [];
	const firstDay = moment(year + '-' + month + '-1');
	const lastDay = firstDay.clone().endOf('month');
	const lastDayNumber = lastDay.date();
	const firstDayWeekDay = firstDay.day();
	const lastDayWeekDay = lastDay.day();
	if (firstDayWeekDay > 0) {
		for (let i = firstDayWeekDay; i > 0; i--) {
			const previousDay = firstDay.clone();
			previousDay.subtract(i, 'days');
			allDates.push(previousDay);
		}
	}
	for (let i = 1; i <= lastDayNumber; i++) {
		allDates.push(firstDay.clone().date(i));
	}
	if (lastDayWeekDay < 6) {
		for (let i = 1; i <= 6 - lastDayWeekDay; i++) {
			allDates.push(lastDay.clone().add(i, 'days'));
		}
	}

	return allDates;
}

export function getAlbumPath(currentEvent) {
	return currentEvent.userId + '/' + currentEvent.date + '/' + currentEvent.id;
}