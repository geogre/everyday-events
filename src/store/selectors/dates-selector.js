import moment from "moment";
import {DAY_NAME, FULL_DATE, SHORT_DATE} from "../../tools/formatter";

export const getDatesInfo = (currentDate) => {
    const theDate = moment(currentDate);
    const firstDate = theDate.clone().startOf('week');
    const endDate = theDate.clone().endOf('week');
    let range = [];
    let curDate = firstDate.clone();
    while(curDate.isBefore(endDate) || curDate.isSame(endDate)) {
        range.push({
           key: curDate.format(FULL_DATE),
           caption: {
               dateNum: curDate.format(SHORT_DATE),
               dateName: curDate.format(DAY_NAME)
           }
        });
        curDate.add(1, 'day');
    }
    const previousDate = theDate.clone().subtract(7, 'days').format(FULL_DATE);
    const nextDate = theDate.clone().add(7, 'days').format(FULL_DATE);
    const theWeek = theDate.week();

    return {
        currentDate: new Date(currentDate),
        startDate: firstDate,
        endDate: endDate,
        week: theWeek,
        previousDate: previousDate,
        nextDate: nextDate,
        datesRange: range
    }
}

export const detectCurrentDate = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentDate = urlParams.get('date');
    if (currentDate && currentDate.match(/^d{4}-d{2}-d{2}$/)) {
        return currentDate;
    }
    const a = moment().format('YYYY-MM-DD');
    console.log(a);
    return a;
}