const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
import {UserPasswordAuthenticator} from "../services/authenticator_user_password";

const auth_options = {};

let user ={
  id : 1,
  username : 'user',
  password : 'password'
}

passport.serializeUser((user:any, done:any) => { done(null, user.id); });
passport.deserializeUser((id:any, done:any) => {
  return done(null, user);
});

passport.use(new LocalStrategy(auth_options, (username:string, password:string, done:any) => {

  const authenticator = new UserPasswordAuthenticator(username,password)

  if (authenticator.authenticate()) {
    return done(null, user);
  } else {
    return done(null, false);
  }  

}));