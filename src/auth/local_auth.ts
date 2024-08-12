const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
import {UserPasswordAuthenticator} from "../services/authenticator_user_password";

const auth_options = {};

passport.serializeUser((user:any, done:any) => { done(null, user); });
passport.deserializeUser((user:any, done:any) => {
  return done(null, user);
});

passport.use(new LocalStrategy(auth_options, (username:string, password:string, done:any) => {

  const authenticator = new UserPasswordAuthenticator(username,password)
  let authenticatedUser = authenticator.authenticate()

  if ( authenticatedUser === false) {
    return done(null, false);
  } else {
    return done(null, authenticatedUser);
  }  

}));

export let passportAuthExports = {
  loginUrl : "/login",
}