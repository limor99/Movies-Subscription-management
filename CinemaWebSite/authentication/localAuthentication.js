/**
 * authentication using username and password
 */

 const usersBL = require('../models/usersBL');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');
/*
passport.use(new LocalStrategy(
     function(username, password, done){
        User.findOne({username: username}, function(err, user){
            if(err){
                console.log("An error occured while try to read from DB (user collection)")
            }
            else{
                if(user){
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
                
    
            }
        })
        
       
    }
))
*/
passport.use(new LocalStrategy(
    async function(username, password, done){
        let theUser = {
            username: username,
            password: password
        }
        console.log("befor BL")
        let user = await usersBL.getUser(theUser);
        console.log("after BL")
        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    }
))
