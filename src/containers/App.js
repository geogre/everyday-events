import React, {useContext} from 'react';
import './App.scss';
import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';
import api_config from '../api/aws-config';
import Impress from './Impress/Impress';
import {AmplifyGreetings} from '@aws-amplify/ui-react';
import {AuthContext} from "../context/AuthContextProvider";
Amplify.configure({...aws_exports, ...api_config});

const App = () => {
    const authContext = useContext(AuthContext);
    return (
        <div className={"App"}>
            <div className={"AppHeader AppHeader_user"}>
                <img src={"/logo.svg"} />
                <AmplifyGreetings username={authContext.user ? authContext.user.username : ''} />
            </div>
            <Impress />
        </div>
    );
}

export default App;
