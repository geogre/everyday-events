import React from "react";
import config from '../aws-exports';
import App from "./App";
import {AmplifyAuthenticator as Authenticator} from "@aws-amplify/ui-react";
import Auth from "@aws-amplify/auth";

class AppWithAuth extends React.Component {

    state = {authState: 'loading'};

    render() {
        console.log(this.props.location);
        return (
                <Authenticator amplifyConfig={config}>
                    <App authState={this.state.authState} />
                </Authenticator>
        );
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log(user);
                if (user) {
                    this.setState({authState: 'signedIn'});
                } else {
                    this.setState({authState: 'signedOut'});
                }
            })
            .catch(err => {
                this.setState({authState: 'loggedOut'});
            });
    }
}

export default AppWithAuth;