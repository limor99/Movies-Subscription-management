const User = require('./userModel');
const userDal = require('../../DAL/UserDAL/userFile');
const permissionDal = require('../../DAL/UserDAL/permissionFile');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/*  get user from DB */
exports.getUser = async function(user){
    let returnUser;
    try{
        let existUser = await User.findOne({username: user.username});

        if(existUser.password){
            let isSamePsw = await bcrypt.compare(user.password, existUser.password);
            if(isSamePsw){
                returnUser = existUser;
            }
            
            return returnUser
        }
    }
    catch(err){
        console.log("An error occured while try to read from DB (user collection): "  + err);
        return returnUser
    }

}
 
/* add new user to the system 
    1. add to db
    2. add to users.json
    3. add to permissions.json
*/

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

/** get all user with their all data from all sources:
 * 1. user collection from db
 * 2. users.json file
 * 3. permission.json file
 */
exports.getAllUsers = async function(){
    let usersData = null;
    //1. read all users from user.json file
    let users = await userDal.readUsersFromFile();
    
    //2. read all users's permissions from permissions.json
    let usersPermissions = await permissionDal.readPermissions();
    
    //3. get all users from DB
    let usersFromDB = await User.find({});
    //4. data shaping
    if(users != undefined && usersPermissions != undefined){
        usersData = users.map(user =>{
            let userPermissions = usersPermissions.filter(permission => permission.id === user.id);
            let userFromDB = usersFromDB.filter(u => u.id === user.id);

        return {
                id: user.id,
                firstName: user.firstName, 
                lastName: user.lastName,
                username : userFromDB[0].username,
                sessionTimeOut: user.sessionTimeOut,
                createdDate : user.createdDate,
                permissions: userPermissions[0].permissions
            }
            
        })
    }

    return usersData;
}

/** get user by id with all his data */
exports.getUserById = async function(userId){
    let users = null;
    let user = null;
    users = await exports.getAllUsers();
    if(users){
        user = users.filter(user => user.id === userId)[0];
    }
    else{
        console.log(`An error occured while try to read user: ${userId} from file`);
    }

    return user;
}

/** update user with his data in users.json & permissions.json */
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

        isUpdateUserPermissions = await permissionDal.writePermissions(usersPermissions);

        //3. update user in db
        let userForDB = {
            "username" : updateUser.username
        }

        let updateUserInDB = await User.findByIdAndUpdate(updateUser.id, userForDB);

        if(isUpdateUser && isUpdateUserPermissions && updateUserInDB){
            isUpdate = true;
        }

    }else{
        console.log(`An error occured while try to update user: ${updateUser.id}: ${err}`);
    }

    return isUpdate;

}

/** delete user from all data source: users.json, permissions.json & user collection in db */
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

/** update the user collection. this function is call when user update his password in db for the first time
 * after the admin create the username 
 */
exports.createAccount = async function(account){
    let isExistAccount = false; //the account created by the admin (only username)
    let isExistFullAccount = false; //the account created by admin and the user set the password already
    let isUpdatedAccount = false; //username and pwd exist for user
    try{
        //if admin created aleady the username for
        let userAccount = await User.findOne({username: account.username})

        if(userAccount.password === undefined){
            let hashPwd = await bcrypt.hash(account.password, saltRounds);

            let updatedAccount = {
                username: account.username,
                password: hashPwd
            }
            
            if(userAccount != null){
                isExistAccount = true;
                await User.findByIdAndUpdate(userAccount.id, updatedAccount);
                isUpdatedAccount = true;
            }
        }
        else{
            isExistFullAccount = true;
        }
    }
    catch(err){
        console.log(`An error occured while try to add new account: username: ${newAccount.username}, pwd: ${newAccount.pwd}`);
    }
    finally{
        let answer = {
            "isExistFullAccount": isExistFullAccount,
            "isExistAccount": isExistAccount,
            "isUpdatedAccount": isUpdatedAccount
        }
        return answer;
    }

}
