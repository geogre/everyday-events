import React from "react";
import App from "./App";
import {AmplifyAuthenticator, AmplifySignIn} from "@aws-amplify/ui-react";
import Auth from "@aws-amplify/auth";


class AppWithAuth extends React.Component {

    state = {authState: 'loading', user: null};

    render() {
        return (
            <div className={`AppWrapper ${this.state.user ? 'AppWrapper_user' : 'AppWrapper_Guest'}`}>
                {this.state.user ? '' : (<div className={"AppHeader AppHeader_guest"}>
                    <img className={"logo"} src={"/logo.svg"} />
                </div>)}
                <AmplifyAuthenticator>
                    <div className={"SignInFormWrapper"}  slot="sign-in">
                        <AmplifySignIn className={"SignInForm"} headerText="Personal storage of your memories" />
                    </div>
                    <div className={"jumbotronWrapper"}  slot="sign-in">
                        <div className="jumbotron">
                            <h1 className="display-4">Do you remember?</h1>
                            <div className="lead">
                                <p>Your first kiss, first steps of your child, your biggest victory</p>
                                <p>A lot of events happen in our life, but we not always remember the date when some specific event happened.</p>
                                <p>But what if you had a tool to save all important events of your life? Just register and create comfortable storage for your memories!</p>
                            </div>
                        </div>
                    </div>
                    <App authState={this.state.authState} user={this.state.user} />
                </AmplifyAuthenticator>
            </div>
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