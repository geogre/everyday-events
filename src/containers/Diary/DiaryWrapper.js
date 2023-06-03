import React from 'react';
import './DiaryWrapper.scss';

function DiaryWrapper(props) {
	return <div className={`DiaryContainer ${props.className}`}><div className={'DiaryHeader'}>{props.headerText}</div><div className={'DiaryContent'}>{props.children}</div></div>;
}

export default DiaryWrapper;
