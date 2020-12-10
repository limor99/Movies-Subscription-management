/**
 * authentication using username and password
 */

 const usersBL = require('../models/usersBL');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

passport.use(new LocalStrategy({passReqToCallback : true},
    async function(req, username, password, done){
        try{
            let theUser = {
                username: username,
                password: password
            }
            let user = await usersBL.getUser(theUser);
            
            if(user){
                return done(null, user, req.flash('success', 'good' ));
            }   
            else{
                return done(null, false, req.flash('error', 'Invalid username or password' ));
            }
        }
        catch(err){
            done(err);
        }
    }
))


passport.serializeUser(async function(user, done) {
    done(null, user.id); 
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
