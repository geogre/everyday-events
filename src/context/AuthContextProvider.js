import React, {useEffect, useState} from 'react';
import {Auth} from "@aws-amplify/auth";
import {Hub} from "aws-amplify";

const defaultState = {
    isLoggedIn: false,
    isLoading: true,
    user: null
};

export const AuthContext = React.createContext(defaultState);

const AuthContextProvider = (props) => {
    const [state, setState] = useState(defaultState);

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(user => {
                if (user) {
                    setState({isLoggedIn: true, user: user});
                } else {
                    setState({isLoggedIn: false, user: null});
                }
            })
            .catch(err => {
                setState(defaultState);
            });
        Hub.listen('auth', (data) => {
                switch (data.payload.event) {
                    case 'signIn':
                        setState({isLoggedIn: true, user: data.payload.data, isLoading: false});
                        break;
                    case 'signUp':
                        setState({isLoggedIn: true, user: data.payload.data, isLoading: false});
                        break;
                    case 'signOut':
                        setState({isLoggedIn: false, user: null, isLoading: false});
                        break;
                    case 'signIn_failure':
                        setState({isLoggedIn: false, user: null, isLoading: false});
                        break;
                    case 'configured':
                        break;
                }
            }
        );
    }, []);

    return (
        <AuthContext.Provider value={state}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
