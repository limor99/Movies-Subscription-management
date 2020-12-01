const jsonFile = require('jsonfile');
const path = require('path');
const usersFile = path.join(__dirname, '../../dataFiles/users.json');

exports.addUserToFile = async function(user){
    let isAdded = false;
    try{
        let existUsersArr = await this.readUsersFromFile();
        newUsersArr = [...existUsersArr, user]

        let isWriten = await this.writeUsersToFile(newUsersArr);
        if(isWriten){
            isAdded = true;
        }
    }
    catch(err){
        console.log(`An error occured while try to add new user to ${usersFile}: ${err}`);
    }
    finally{
        return isAdded;
    }
}

exports.readUsersFromFile = async function(){
    let users = null;;
    
    try{
        users = await jsonFile.readFile(usersFile);
    }
    catch(err){
        console.log(`An error occured while try to read from ${usersFile}: ${err}`);
    }
    finally{
        return users;
    }
    }

exports.writeUsersToFile = async function(users){
    let isWritten = false;
    try{
        await jsonFile.writeFile(usersFile, users);
        isWritten = true;
    }
    catch(err){
        console.log(`An error occured while try to write to ${usersFile}: ${err}`);
    }
    finally{
        return isWritten;
    }
}
