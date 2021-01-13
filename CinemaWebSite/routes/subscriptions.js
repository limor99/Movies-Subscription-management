var express = require('express');
var router = express.Router();

const membersBL = require('../models/Members/memberBL');
const subscriptionsMoviesBL = require('../models/Members/subscriptionsMoviesBL');

const checkSessionTimeout = require('../middlewares/checkSessionTimeout');
const checkPermissions =  require('../middlewares/checkPermissions');

router.get('/', checkSessionTimeout(), checkPermissions("View Subscriptions"), async function(req, res, next) {
  let subscriptionsMovies = await subscriptionsMoviesBL.getSubscriptionsMovies();

  if(subscriptionsMovies){
    res.render('subscriptions/subscriptions', { title: 'Subscriptions Page' , msg: '', subscriptionsMovies : subscriptionsMovies});
  }
  else{
    res.render('main', {title: "Main Page", message: `An error occured while try get members's subscriptions`});
  }  
});

router.get('/new', checkSessionTimeout(), checkPermissions("Create Subscriptions"), function(req, res, next) {
  res.render('subscriptions/newMember', { title : "Add Member Page"});
});

router.get('/edit/:id', checkSessionTimeout(), checkPermissions("Update Subscriptions"), async function(req, res, next) {
  let member = null;
  let memberId = req.params.id;
  
  let answer = await membersBL.getMemberById(memberId);

  if(answer != null){
    if(answer.success){
      member = answer.member;
      
      res.render('subscriptions/editMember', { title : "Member Page", member : member});
    }
    else{
      res.send(`An error occured while trying to update member: ${memberId}`);
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to get the member: ${memberId} data');
  }
});


router.post('/new/add', async function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let city = req.body.city;
  
  let newMember = {
    "name" : name,
    "email" : email, 
    "city" : city
  }

  let answer = await membersBL.addMember(newMember);
  
  if(answer != null){
    let members = await membersBL.getMembers();
    if(members){
      res.render('subscriptions/subscriptions', { title : "Subscriptions Page", msg : answer.msg, members: members});  
    }
    else{
      res.send('member added, but an error occured while trying to get all members');
    }
  }
  else{
    //genereal error
    res.send('An error occured while trying to save the member');
  }
  
});


router.get('/:id', checkPermissions("View Subscriptions"), async function(req, res, next) {
  let member = null;
  let memberId = req.params.id;
  
  let answer = await membersBL.getMemberById(memberId);

  if(answer != null){
    if(answer.success){
      member = answer.member;
      
      res.render('subscriptions/member', { title : "Member Page", member : member});
    }
    else{
      res.send(`An error occured while trying to get data of member: ${memberId}`);
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to get the member: ${memberId} data');
  }
});


router.post('/update', async function(req, res, next) {
  let memberId = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let city = req.body.city;

  let member = {
    "id" : memberId,
    "name" : name,
    "email" : email, 
    "city" : city
  }

  let answer = await membersBL.updateMember(member);

  if(answer != null){
    let subscriptionsMovies = await subscriptionsMoviesBL.getSubscriptionsMovies();

    if(subscriptionsMovies){
      res.render('subscriptions/subscriptions', { title: 'Subscriptions Page' , msg: answer.msg, subscriptionsMovies : subscriptionsMovies});
    }
    else{
      res.send('member Updated, but an error occured while trying to get all members with there subscribed movies');
    }
  }
  else{
    //genereal error
    res.render('error', {message: 'An error occured while trying to save the member', page: "subscriptions"});
  }

});

router.get('/delete/:id', checkPermissions("Delete Subscriptions"), async function(req, res, next) {
  let memberId = req.params.id
  
  let answer = await membersBL.deleteMember(memberId);

  if(answer != null){
    let members = await membersBL.getMembers();
    if(members){
      res.render('subscriptions/subscriptions', { title : "Members Page", msg : answer.msg, members: members});  
    }
    else{
      res.send('member deleted, but an error occured while trying to get all members');
    }

  }
  else{
    //genereal error
    res.render('error', {message: 'An error occured while trying to delete the member', page: "subscriptions"});
  }

});

router.post("/subscribe", async function(req, res, next){
  let memberId = req.body.memberId;
  let subscribeMovieId = req.body.unwatch;
  let watchedDate = req.body.watchedDate;

  let subscribeMovie = {
    memberId,
    subscribeMovieId,
    watchedDate : new Date(watchedDate)
  }

  let answer = await subscriptionsMoviesBL.subscribeToMovie(subscribeMovie);

  if(answer != null){
    if(answer.success){
      let subscriptionsMovies = await subscriptionsMoviesBL.getSubscriptionsMovies();
      if(subscriptionsMovies){
        res.render('subscriptions/subscriptions', { title : "Subscriptions Page", msg : answer.msg, subscriptionsMovies: subscriptionsMovies});  
      }
      else{
        res.render('main', {title: "Main Page", message: `An error occured while try get members's subscriptions`});
      }
    }
    else{
      res.render('main', {title: "Main Page", message: `An error occured while try to add subscriptions to movie ${subscribeMovieId} to user ${memberId}`});
    }
  }
  else{
    //genereal error
    res.render('error', {message: `An error occured while try to add subscriptions to movie ${subscribeMovieId} to user ${memberId}`, page: "subscriptions"});
  }

})

module.exports = router;
