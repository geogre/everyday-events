import React from 'react';
import './DayCaption.scss';

const dayCaption = (props ) =>  {

    return (
            <div onClick={props.onClick} className={"day-caption" + (props.current ? " current" : "")}>
                <div className="day-title">{props.caption.dateName}</div>
                <div className="day-num">{props.caption.dateNum}</div>
            </div>
    );
}

export default dayCaption;
