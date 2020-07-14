import React from "react";
import App from "./App";
import {AmplifyAuthenticator, AmplifySignIn} from "@aws-amplify/ui-react";
import Auth from "@aws-amplify/auth";


class AppWithAuth extends React.Component {

    state = {authState: 'loading'};

    render() {
        return (
            <AmplifyAuthenticator>
                <div className="jumbotron" slot="sign-in">
                    <h1 className="display-4">Hello, world!</h1>
                    <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra
                        attention to featured content or information.</p>
                </div>
                <AmplifySignIn headerText="My Custom Sign In Header" slot="sign-in" />
                <App authState={this.state.authState} />
            </AmplifyAuthenticator>
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
                this.setState({authState: 'signedOut'});
            });
    }
}

export default AppWithAuth;