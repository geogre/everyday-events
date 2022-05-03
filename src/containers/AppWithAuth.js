import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import App from "./App";
import GuestApp from "./GuestApp";

const AppWithAuth = (props) => {

    const authContext = useContext(AuthContext);

    return (
        <React.Fragment>
            {authContext.isLoading && <p>Loading...</p>}
            {authContext.isLoggedIn && !authContext.isLoading && <App {...props}/>}
            {!authContext.isLoggedIn && !authContext.isLoading && <GuestApp />}
        </React.Fragment>
    );
}
export default AppWithAuth;
