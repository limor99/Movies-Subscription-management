const { request } = require('express');
var express = require('express');
var router = express.Router();

const usersBl = require('../models/Users/usersBL');

const checkSessionTimeout = require('../middlewares/checkSessionTimeout');

/* GET users listing. */
router.get('/', checkSessionTimeout(), async function(req, res, next) {
  let users = await usersBl.getAllUsers();
  if(users){
    res.render('users/users', { title : "All Users Page", users: users});  
  }
  else{
    res.send('An error occured while trying to get all users');
  }

  
});

router.post('/new/add', checkSessionTimeout(), async function(req, res, next) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let username = req.body.username;
    let sessionTimeOut = req.body.sessionTimeOut;
    
    let userPermissions = [];
    req.body.viewSubscriptions != undefined ? userPermissions.push("View Subscriptions") : null;
    req.body.createSubscriptions != undefined ? userPermissions.push("Create Subscriptions") : null;
    req.body.deleteSubscriptions != undefined ? userPermissions.push("Delete Subscriptions") : null;
    req.body.updateSubscriptions != undefined ? userPermissions.push("Update Subscriptions") : null;
    req.body.viewMovies != undefined ? userPermissions.push("View Movies") : null;
    req.body.createMovies != undefined ? userPermissions.push("Create Movies") : null;
    req.body.deleteMovies != undefined ? userPermissions.push("Delete Movies") : null;
    req.body.updateMovies != undefined ? userPermissions.push("Update Movies") : null;


    let newUser = {
      "firstName" : firstName,
      "lastName" : lastName,
      "username" : username,
      "sessionTimeOut" : sessionTimeOut,
      "permissions" : userPermissions

    }

    let isAdded = await usersBl.addNewUser(newUser);

    if(isAdded){
      let users = await usersBl.getAllUsers();
      if(users){
        res.render('users/users', { title : "All Users Page", users: users});  
      }
      else{
        res.send('user Updated, but an error occured while trying to get all users');
      }
    }
    else{
      res.send('user not added')
    }
  
});


router.post('/update', checkSessionTimeout(), async function(req, res, next) {
  let id = req.body.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let createdDate = req.body.createdDate;
  let sessionTimeOut = req.body.sessionTimeOut;

  let userPermissions = [];
  req.body.viewSubscriptions != undefined ? userPermissions.push("View Subscriptions") : null;
  req.body.createSubscriptions != undefined ? userPermissions.push("Create Subscriptions") : null;
  req.body.deleteSubscriptions != undefined ? userPermissions.push("Delete Subscriptions") : null;
  req.body.updateSubscriptions != undefined ? userPermissions.push("Update Subscriptions") : null;
  req.body.viewMovies != undefined ? userPermissions.push("View Movies") : null;
  req.body.createMovies != undefined ? userPermissions.push("Create Movies") : null;
  req.body.deleteMovies != undefined ? userPermissions.push("Delete Movies") : null;
  req.body.updateMovies != undefined ? userPermissions.push("Update Movies") : null;


  let user = {
    "id": id,
    "firstName" : firstName,
    "lastName" : lastName,
    "username" : username,
    "sessionTimeOut" : sessionTimeOut,
    "createdDate" : createdDate,
    "permissions" : userPermissions
  }

  let isUpdated = await usersBl.updateUser(user);

  if(isUpdated){
    let users = await usersBl.getAllUsers();
    if(users){
      res.render('users/users', { title : "All Users Page", users: users});  
    }
    else{
      res.send('user Updated, but an error occured while trying to get all users');
    }
  }
  else{
    res.send('user not updated');
  }


});

router.get('/new', checkSessionTimeout(), function(req, res, next) {
  res.render('users/newUser', { title : "Add User Page"});
});

router.get('/edit/:id', checkSessionTimeout(), async function(req, res, next) {
  let userId = req.params.id;
  let user = await usersBl.getUserById(userId);

  if(user){
    res.render('users/editUser', { title : "All Users Page", user : user});
  }
  else{
    res.send(`An error occured while trying to update user: ${userId}`);
  }

  
});

router.get('/delete/:id', checkSessionTimeout(), async function(req, res, next){
  let userId = req.params.id;
  let isDeleted = await usersBl.deleteUser(userId);
  if(isDeleted){
    let users = await usersBl.getAllUsers();
    if(users){
      res.render('users/users', { title : "All Users Page", users: users});  
    }
    else{
      res.send('user Deleted, but an error occured while trying to get all users');
    }
  }
  else{
    res.send('user not Deleted, please check all relevant sources: users collection in db, users.json file, permissions.json file');
  }
});


router.get('/createAccount', function(req, res, next) {
  res.render('users/createAccountPage', { data : "Create Account Page", msg:''});
});

router.post('/newAccount', async function(req, res, next){
  let username = req.body.username;
  let password = req.body.password;

  let newAccount = {
    "username": username,
    "password" : password  
  }

  let answer = await usersBl.createAccount(newAccount);

  if(answer.isExistFullAccount){
    res.render('login', {data : 'Login Page', message: 'User exist, please login'})
  }
  else if(!answer.isExistAccount){
    res.render('users/createAccountPage', {data : "Create Account Page", msg: 'This user account doe\'s not exist, please contat the admin'});
  }
  else if(answer.isUpdatedAccount){
    res.render('login', {data : 'Login Page', message: ''})
  }
  else{
    res.render('users/createAccountPage', {data : "Create Account Page", msg: 'An error occured, please try again'});
  }

})

module.exports = router;
