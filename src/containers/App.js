import React from 'react';
import './App.scss';
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import api_config from '../api/aws-config';
import Impress from './Impress/Impress';
import {Button} from "@aws-amplify/ui-react";
import '../eeTheme.scss';
Amplify.configure({...aws_exports, ...api_config});


const App = () => {
    const logout = () => {
        Auth.signOut();
    }

    return (
        <div className={"App"}>
            <div className={"AppHeader AppHeader_user"}>
                <div><img src={"/logo.svg"} /></div>
                <div><Button onClick={logout}>Logout</Button></div>
            </div>
            <Impress />
        </div>
    );
}

export default App;
