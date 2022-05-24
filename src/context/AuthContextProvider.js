import React, {useEffect, useState} from 'react';
import {Hub, Auth} from "aws-amplify";

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
                console.log(user);
                if (user) {
                    setState({isLoggedIn: true, user: user, isLoading: false});
                } else {
                    setState({isLoggedIn: false, user: null, isLoading: false});
                }
            })
            .catch(err => {
                console.log('something is wrong');
                setState({isLoggedIn: false, user: null, isLoading: false});
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
                    default:
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
