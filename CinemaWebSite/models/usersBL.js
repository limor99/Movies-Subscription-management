const User = require('./userModel');
const userDal = require('../DAL/UserDAL/userFile');
const permissionDal = require('../DAL/UserDAL/permissionFile');

exports.getUser = async function(user){
    console.log("BL")
    let returnUser;
    try{
        returnUser = await User.findOne({username: user.username});
        
    }
    catch(err){
        console.log("An error occured while try to read from DB (user collection): "  + err);
    }

    return  returnUser;
}
 
exports.addNewUser = async function(user){
    let isAdded = false;
    try{
        // 1. add to DB
        let NewUser = new User(user);
        let createdUser = await NewUser.save();
        
        // 2. add new user to users.json file
        let newUser = { "id": createdUser.id,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "username": user.username,
                        "createdDate": new Date().toLocaleDateString('en-GB'),
                        "sessionTimeOut": parseInt(user.sessionTimeOut)
                    }
                    
        let isUserAddedToFile = await userDal.addUserToFile(newUser);
                
        // 3. add new user to permisions.json file
       /* let newUserPermisions = { "id": createdUser.id,
                                    "permisions": 
                                        [{"viewSubscriptions": user.viewSubscriptions}, 
                                        {"createSubscriptions": user.createSubscriptions}, 
                                        {"deleteSubscriptions": user.deleteSubscriptions}, 
                                        {"updateSubscriptions": user.updateSubscriptions}, 
                                        {"viewMovies": user.viewMovies}, 
                                        {"createMovies": user.createMovies}, 
                                        {"deleteMovies": user.deleteMovies}, 
                                        {"updateMovies": user.updateMovies}]
                                     }
*/
let newUserPermisions = { "id": createdUser.id,
                                    "permissions": user.permissions
                                     }
        let isNewUserPermissionAddedToFile = await permissionDal.addUserPermissionToFile(newUserPermisions);
       
        isAdded = isUserAddedToFile && isNewUserPermissionAddedToFile;
        
    }
    catch(err){
        console.log("An error occured while try to add new user to DB and/or to json files: "  + err);
        
    }
    finally{
        return isAdded;
    }
}

exports.getAllUsers = async function(){
    let usersData = null;
    //1. read al users
    let users = await userDal.readUsersFromFile();
    //console.table(users);
    //2. read all users's permissions
    let usersPermissions = await permissionDal.readPermissions();
    
    //3. data shaping
    if(users != undefined && usersPermissions != undefined){
        usersData = users.map(user =>{
            let userPermissions = usersPermissions.filter(permission => permission.id === user.id);

            return {
                id: user.id,
                firstName: user.firstName, 
                lastName: user.lastName,
                username : user.username,
                sessionTimeOut: user.sessionTimeOut,
                createdDate : user.createdDate,
                permissions: userPermissions[0].permissions
            }
            
        })
    }

    return usersData;
}

exports.getUserById = async function(userId){
    let users = null;
    let user = null;
    users = await this.getAllUsers();
    if(users){
        user = users.filter(user => user.id === userId)[0];
    }
    else{
        console.log(`An error occured while try to read user: ${userId} from file: ${err}`);
    }

    return user;
}

exports.updateUser = async function(updateUser){
    let isUpdate = false;
    let isUpdateUser = false;
    let isUpdateUserPermissions = false;
    
    let userToUpdate = {
        "id" : updateUser.id,
        "firstName" : updateUser.firstName,
        "lastName" : updateUser.lastName,
        "username" : updateUser.username,
        "createdDate" : updateUser.createdDate,
        "sessionTimeOut" : updateUser.sessionTimeOut
    }

    let users = await userDal.readUsersFromFile();

    // 1. update the user.json
    if(users){
        console.table(users);
        let index = users.findIndex(user => user.id === userToUpdate.id);
        users[index] = userToUpdate;
        console.table(users);
        isUpdateUser = await userDal.writeUsersToFile(users);
        
        let userPermissionsToUpdate = {
            "id" : updateUser.id,
            "permissions" : updateUser.permissions
        }

        let usersPermissions = await permissionDal.readPermissions();
        let indexPermossions = usersPermissions.findIndex(per => per.id === userPermissionsToUpdate.id);
        usersPermissions[indexPermossions] = userPermissionsToUpdate;

        isUpdateUserPermissions = permissionDal.writePermissions(usersPermissions);

        if(isUpdateUser && isUpdateUserPermissions){
            isUpdate = true;
        }

    }else{
        console.log(`An error occured while try to update user: ${updateUser.id}: ${err}`);
    }

    return isUpdate;

}

exports.deleteUser = async function(userId){
    let isDeleted = false;
    let isDeletedFromPermissions = false;
    let isDeletedFromUsersFile = false;
    let isDeleteUserFromDB = false;
    // 1. delete from permissions.json file
    let usersPermissions = await permissionDal.readPermissions();

    if(usersPermissions != null){
        let indexId = usersPermissions.findIndex(p => p.id === userId);
        usersPermissions.splice(indexId, 1);
        isDeletedFromPermissions = await permissionDal.writePermissions(usersPermissions);
    }
    else{
        console.log(`An error occured while try to delete user: ${userId} from permissions.json`)
    }

    // 2. delete from users.json file
    let usersFromFile = await userDal.readUsersFromFile();
    if(usersFromFile != null){
        let indexId = usersFromFile.findIndex(user => user.id === userId);
        usersFromFile.splice(indexId, 1);
        let usersToUpdate = usersFromFile;
        isDeletedFromUsersFile = await userDal.writeUsersToFile(usersToUpdate);
    }
    else{
        console.log(`An error occured while try to delete user: ${userId} from users.json`)
    }

    // 3. delete from db (users collections)
    try{
        await User.findByIdAndDelete();
        isDeleteUserFromDB = true;
    }
    catch(err){
        console.log(`An error occured while try to delete user: ${userId} from db, users collection`)
    }

    if(isDeletedFromPermissions && isDeletedFromUsersFile && isDeleteUserFromDB){
        isDeleted = true;
    }

    return isDeleted;
    
}