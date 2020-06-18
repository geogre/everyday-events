import React from "react";
import {
    SectionBody, SectionFooter,
    SectionHeader
} from "aws-amplify-react";
import {
    AmplifyFormField as FormField,
    AmplifyHint as Hint,
    AmplifyInput as Input,
    AmplifyLabel as InputLabel,
    AmplifyFormSection as FormSection,
    AmplifySignIn as SignIn,
    AmplifySignUp as SignUp,
    AmplifyForgotPassword as ForgotPassword,
    AmplifyButton as Button,
    AmplifyLink as Link,
    AmplifyFederatedButtons as FederatedButtons
} from "@aws-amplify/ui-react";
import {I18n} from "@aws-amplify/core";
import {Auth as auth} from "@aws-amplify/auth";

export class ImpressSignIn extends SignIn {
    showComponent(theme) {
        const {
            authState,
            hide = [],
            federated,
            onStateChange,
            onAuthEvent,
            override = [],
        } = this.props;
        if (hide && hide.includes(SignIn)) {
            return null;
        }
        const hideSignUp =
            !override.includes('SignUp') &&
            hide.some(component => component === SignUp);
        const hideForgotPassword =
            !override.includes('ForgotPassword') &&
            hide.some(component => component === ForgotPassword);
        return (
            <FormSection theme={theme} data-test={auth.signIn.section}>
                <SectionHeader theme={theme} data-test={auth.signIn.headerSection}>
                    {I18n.get('Sign in to your account')}
                </SectionHeader>
                <FederatedButtons
                    federated={federated}
                    theme={theme}
                    authState={authState}
                    onStateChange={onStateChange}
                    onAuthEvent={onAuthEvent}
                />
                <form onSubmit={this.signIn}>
                    <SectionBody theme={theme}>
                        {this.renderUsernameField(theme)}
                        <FormField theme={theme}>
                            <InputLabel theme={theme}>{I18n.get('Password')} *</InputLabel>
                            <Input
                                placeholder={I18n.get('Enter your password')}
                                theme={theme}
                                key="password"
                                type="password"
                                name="password"
                                onChange={this.handleInputChange}
                                data-test={auth.signIn.passwordInput}
                            />
                            {!hideForgotPassword && (
                                <Hint theme={theme}>
                                    {I18n.get('Forget your password? ')}
                                    <Link
                                        theme={theme}
                                        onClick={() => this.changeState('forgotPassword')}
                                        data-test={auth.signIn.forgotPasswordLink}
                                    >
                                        {I18n.get('Reset password')}
                                    </Link>
                                </Hint>
                            )}
                        </FormField>
                    </SectionBody>
                    <SectionFooter theme={theme} data-test={auth.signIn.footerSection}>
                        <div theme={theme}>
                            <Button
                                theme={theme}
                                type="submit"
                                disabled={this.state.loading}
                                data-test={auth.signIn.signInButton}
                            >
                                {I18n.get('Sign In')}
                            </Button>
                        </div>
                        {!hideSignUp && (
                            <div theme={theme}>
                                {I18n.get('No account? ')}
                                <Link
                                    theme={theme}
                                    onClick={() => this.changeState('signUp')}
                                    data-test={auth.signIn.createAccountLink}
                                >
                                    {I18n.get('Create account')}
                                </Link>
                            </div>
                        )}
                    </SectionFooter>
                </form>
            </FormSection>
        );
    }
}