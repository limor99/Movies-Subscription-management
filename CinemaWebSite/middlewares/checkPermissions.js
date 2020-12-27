/**
 * This function check user's permission for doing action in the system.
 * If user login check his permissions.
 * If user not login (session tomeout) go to login page
 * @param {*} permission 
 */
const checkPermissions = function (permission){
    return function(req, res, next){
        let user = req.session.user;
        
        if(user != null){
            userPermissions = user.permissions;

            if(userPermissions != null && userPermissions.includes(permission)){
                next();
            }
            else{
                res.render('main', {title: "Main Page", message: `You have no permission for ${permission}`});
            }
        }
        else{   //for session timeout
            res.render('login', {data : 'Login Page', message: 'Session timeout, please login'})
        }
    }

}

module.exports = checkPermissions;