const checkPermissions = function (permission){
    return function(req, res, next){
        let user = req.session.user;
        
        if(user != null){
            userPermissions = user.permissions;
        }

        if(userPermissions.includes(permission)){
            next();
        }
        else{
            res.render('main', {title: "Main Page", message: `You have no permission for ${permission}`});
        }
    
    }

}

module.exports = checkPermissions;