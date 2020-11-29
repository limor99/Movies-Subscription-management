const jsonFile = require('jsonfile');
const path = require('path');
const permissionsFile = path.join(__dirname, '/../../dataFiles/permissions.json');

exports.addUserPermissionToFile = async function(userPermission){
    let isAdded = false;
    
    try{
        //let existUsersPermisionsArr = await jsonFile.readFile(permissionsFile);
        let existUsersPermisionsArr = await this.readPermissions();
        newPermisionsArr = [...existUsersPermisionsArr, userPermission]

        let isWritten = this.writePermissions(newPermisionsArr);

        if(isWritten){
            isAdded = true;
        }
    }
    catch(err){
        console.log(`An error occured while try to add user's permissions in ${permissionsFile}: ${err}`);
    }
    finally{
        return isAdded;
    }
    

}

exports.readPermissions = async function(){
    let permissions = null;
    
    try{
        permissions = await jsonFile.readFile(permissionsFile);
    }
    catch(err){
        console.log(`An error occured while try to read from ${permissionsFile}: ${err}`);
    }
    finally{
        return permissions;
    }
   

}


exports.writePermissions = async function(permissions){
    let isWritten = false;
    
    try{
        await jsonFile.writeFile(permissionsFile, permissions)
        isWritten = true;
    }
    catch(err){
        console.log(`An error occured while try to write to ${permissionsFile}: ${err}`);
    }
    finally{
        return isWritten;
    }
   

}