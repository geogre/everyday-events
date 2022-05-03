import React from 'react';
import './App.scss';
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import api_config from '../api/aws-config';
import Impress from './Impress/Impress';
import {Button} from "@aws-amplify/ui-react";
Amplify.configure({...aws_exports, ...api_config});

const App = () => {
    const logout = () => {
        Auth.signOut();
    }

    return (
        <div className={"App"}>
            <div className={"AppHeader AppHeader_user"}>
                <img src={"/logo.svg"} />
                <Button onClick={logout}>Logout</Button>
            </div>
            <Impress />
        </div>
    );
}

export default App;
