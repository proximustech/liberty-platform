const passport = require('koa-passport');
const OpenIDConnectStrategy = require('passport-openidconnect');
import { MongoDbUserAuthenticator  as Authenticator } from "../plugins/users_control/services/mongodb_authenticator_user";

/*
OIDC Notes:
  Definitions:
    Client or Relying Party: Liberty Platform
    OIDC Provider: Microsoft, Google, etc ...

  Flow:
    Client redirects to OIDC Provider with callback url
    OIDC Provider authenticates and asks if the user wants to allow the Client access the profile
    OIDC Provider redirects to callback url with the authorization code
    Client asks for the Access Token to the OIDC Provider using the received authorization code
    OIDC Provider gives the Client the JWT ACCESS TOKEN wich includes the user profile info

Library Notes:
  Reference:
    https://github.com/jaredhanson/passport-openidconnect?tab=readme-ov-file

Microsoft notes:

  In Microsoft Entra ID:
    Register the APP
      Manage -> Authentication
        Add Platform
        Enable ID Tokens
        Manifest:
          Old version. Set to true the oauth2AllowImplicitFlow
      Create a Client secret

  Reference:
    https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc
    https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
    https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-AADSTS50020-user-account-identity-provider-does-not-exist
    https://learn.microsoft.com/es-es/entra/identity/hybrid/connect/choose-ad-authn

  issuier:
    https://login.microsoftonline.com/{tenant id}/oauth2/v2.0/authorize,
    When personal account is used, The issuer uses the MSA generic tenant GUID: 9188040d-6c67-4c5b-b112-36a304b66dad

  authorizationURL:
    https://login.microsoftonline.com/{tenant id}/oauth2/v2.0/authorize
    when authenticating personal accounts also, use instead https://login.microsoftonline.com/common/oauth2/v2.0/authorize

  url for logging off: https://login.microsoftonline.com/common/oauth2/v2.0/logout
*/

const auth_options = {
    issuer: process.env.OIDC_ISSUER,
    authorizationURL: process.env.OIDC_AUTHORIZATION_URL,
    tokenURL: process.env.OIDC_TOKEN_URL,
    userInfoURL: process.env.OIDC_USER_INFO_URL,
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: process.env.OIDC_CALLBACK_URL,
    skipUserProfile: false,
    scope:"profile"
  };

passport.serializeUser((user:any, done:any) => { done(null, user); });
passport.deserializeUser((user:any, done:any) => {
  return done(null, user);
});

passport.use(new OpenIDConnectStrategy(auth_options, async function verify (issuer:string, profile:any, done:any) {

    //Available in profile: profile.displayName,profile.username //only when scope:"profile" and skipUserProfile: false are set.
    let authenticator = new Authenticator(profile.username)
    let authenticatedUser:any = await authenticator.authenticate()

    
    if ( authenticatedUser === false) {
      return done(null, false);
    } else {
      authenticatedUser.federated = true
      return done(null, authenticatedUser);
    }  

}));