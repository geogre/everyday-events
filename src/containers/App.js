import React from 'react';
import './App.scss';
import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';
import api_config from '../api/aws-config';
import Impress from './Impress/Impress';
import {AmplifyGreetings} from '@aws-amplify/ui-react';
Amplify.configure({...aws_exports, ...api_config});

const App = (props) => {
    return (
        <div className={"App"}>
            <div className={"AppHeader AppHeader_user"}>
                <img src={"/logo.svg"} />
                <AmplifyGreetings username={props.user ? props.user.username : ''} />
            </div>
            <Impress authState={props.authState} />
        </div>
    );
}

export default App;
