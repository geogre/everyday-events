import React from 'react';
import { Authenticator } from "@aws-amplify/ui-react";

const GuestApp = () => {
    return (
        <div className={`AppWrapper AppWrapper_Guest'}`}>
            <div className={"AppHeader AppHeader_guest"}>
                <img className={"logo"} src={"/logo.svg"} />
            </div>
            <div className={'HomeContent'}>
                <div className={"SignInFormWrapper"}>
                    <Authenticator loginMechanisms={['username']} />
                </div>
                <div className={"jumbotronWrapper"}>
                    <div className="jumbotron">
                        <h1 className="display-4">Do you remember?</h1>
                        <div className="lead">
                            <p>Your first kiss, first steps of your child, your biggest victory</p>
                            <p>A lot of events happen in our life, but we not always remember the date when some
                                specific event happened.</p>
                            <p>But what if you had a tool to save all important events of your life? Just register
                                and create comfortable storage for your memories!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'BottomPicture'}></div>
            <div className={'TopPicture'}></div>
            <div className={'RightPicture'}></div>
        </div>
    );
}

export default GuestApp;
