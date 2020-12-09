/**
 * authentication using username and password
 */

 const usersBL = require('../models/usersBL');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

passport.use(new LocalStrategy(
    async function(username, password, done){
        try{
            let theUser = {
                username: username,
                password: password
            }
            let user = await usersBL.getUser(theUser);
            
            if(user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        }
        catch(err){
            done(err);
        }
    }
))


passport.serializeUser(async function(user, done) {
    console.log("paspport 111:" + user.id)
    done(null, user.id); 
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log("paspport 2222 " + user)
      done(err, user);
    });
  });
