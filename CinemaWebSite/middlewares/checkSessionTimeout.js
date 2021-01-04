/**
 * This function check user's session timeout
 * If user not login (session tomeout) go to login page
  */
const checkSessionTimeout = function (){
    return function(req, res, next){
        let user = req.session.user;
        
        if(user == null){
            res.render('login', {data : 'Login Page', message: 'Session timeout, please login'})
        }
        next();

    }

}

module.exports = checkSessionTimeout;