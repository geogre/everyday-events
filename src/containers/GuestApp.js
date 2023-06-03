import React from 'react';
import './GuestApp.scss';
import '@aws-amplify/ui-react/styles.css';
import Diary from "./Diary/Diary";

const GuestApp = () => {
    return (
        <div className={`AppWrapper AppWrapper_Guest'}`}>
            <div className={"AppHeader AppHeader_guest"}>
                <img className={"logo"} src={"/logo.svg"} />
            </div>
            <Diary />
            <div className={'BottomPicture'}></div>
            <div className={'TopPicture'}></div>
            <div className={'RightPicture'}></div>
        </div>
    );
}

export default GuestApp;
