import React from 'react';
import './DayCaption.scss';

const dayCaption = (props ) =>  {
    const separatedDateNum = props.caption.dateNum.split('/');
    const separator = window.matchMedia('(max-width: 1024px)').matches ? '—' : '/';
    return (
            <div onClick={props.onClick} className={"day-caption" + (props.current ? " current" : "")}>
                <div className="day-title">{props.caption.dateName}</div>
                <div className="day-num">
                    <div className="day-part">{separatedDateNum[0]}</div>
                    <div className="separator-part">{separator}</div>
                    <div className="month-part">{separatedDateNum[1]}</div>
                </div>
            </div>
    );
}

export default dayCaption;
