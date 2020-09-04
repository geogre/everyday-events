import React from "react";
import App from "./App";
import {AmplifyAuthenticator, AmplifySignIn} from "@aws-amplify/ui-react";
import Auth from "@aws-amplify/auth";


class AppWithAuth extends React.Component {

    state = {authState: 'loading', user: null};

    render() {
        return (
            <AmplifyAuthenticator>
                <AmplifySignIn className={"SignInForm"} headerText="Personal storage of your memories" slot="sign-in" />
                <div className="jumbotron" slot="sign-in">
                    <h1 className="display-4">Hello, world!</h1>
                    <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra
                        attention to featured content or information.</p>
                </div>
                <App authState={this.state.authState} user={this.state.user} />
            </AmplifyAuthenticator>
            );
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log(user);
                if (user) {
                    this.setState({authState: 'signedIn', user: user});
                } else {
                    this.setState({authState: 'signedOut', user: null});
                }
            })
            .catch(err => {
                this.setState({authState: 'signedOut'});
            });
    }
}

export default AppWithAuth;