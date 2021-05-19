import React from "react";
import App from "./App";
import {AmplifyAuthenticator, AmplifySignIn} from "@aws-amplify/ui-react";
import {Auth} from "@aws-amplify/auth";
import {Hub} from "aws-amplify";


class AppWithAuth extends React.Component {

    state = {authState: 'loading', user: null};

    render() {
        if (this.state.user) {
            return (<App authState={this.state.authState} user={this.state.user}/>);
        } else return (
            <div className={`AppWrapper AppWrapper_Guest'}`}>
                {this.state.user ? '' : (<div className={"AppHeader AppHeader_guest"}>
                    <img className={"logo"} src={"/logo.svg"}/>
                </div>)}
                <div className={'HomeContent'}>
                    <div className={"SignInFormWrapper"}>
                        <AmplifyAuthenticator>

                            <AmplifySignIn className={"SignInForm"} headerText="Personal storage of your memories"/>

                        </AmplifyAuthenticator>
                    </div>
                    <div className={"jumbotronWrapper"}>
                        <div className="jumbotron">
                            <h1 className="display-4">Do you remember?</h1>
                            <div className="lead">
                                <p>Your first kiss, first steps of your child, your biggest victory</p>
                                <p>A lot of events happen in our life, but we not always remember the date when some
                                    specific event happened.</p>
                                <p>But what if you had a tool to save all important events of your life? Just register
                                    and create comfortable storage for your memories!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'BottomPicture'}></div>
                <div className={'TopPicture'}></div>
                <div className={'RightPicture'}></div>
            </div>
        );
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser()
            .then(user => {
                //console.log(user);
                if (user) {
                    this.setState({authState: 'signedIn', user: user});
                } else {
                    this.setState({authState: 'signedOut', user: null});
                }
            })
            .catch(err => {
                this.setState({authState: 'signedOut'});
            });
        Hub.listen('auth', (data) => {
            //console.log(data);
            switch (data.payload.event) {
                case 'signIn':
                    this.setState({authState: 'signedIn', user: data.payload.data});
                    break;
                case 'signUp':
                    this.setState({authState: 'signedIn', user: data.payload.data});
                    break;
                case 'signOut':
                    this.setState({authState: 'signedIn', user: null});
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed');
                    break;
                case 'configured':
                    console.log('the Auth module is configured');
            }
        });
    }
}
export default AppWithAuth;
