import { useContext } from "react";
import { AmplifyProvider } from '@aws-amplify/ui-react';
import { AuthContext } from "../context/AuthContextProvider";
import App from "./App";
import GuestApp from "./GuestApp";
import '../eeTheme.scss';

const AppWithAuth = (props) => {

    const authContext = useContext(AuthContext);

    return (
        <AmplifyProvider>
            {authContext.isLoading && <p>Loading...</p>}
            {authContext.isLoggedIn && !authContext.isLoading && <App {...props}/>}
            {!authContext.isLoggedIn && !authContext.isLoading && <GuestApp />}
        </AmplifyProvider>
    );
}
export default AppWithAuth;
