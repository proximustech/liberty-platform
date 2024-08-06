const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

const auth_options = {};

let user ={
  id : 1,
  username : 'user',
  password : 'password'
}

passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser((id, done) => {
  return done(null, user);
});

passport.use(new LocalStrategy(auth_options, (username, password, done) => {
  let user ={
    id : 1,
    username : 'user',
    password : 'password'
  }
  if (password === user.password && username === user.username) {
      return done(null, user);
    } else {
      return done(null, false);
    }
}));