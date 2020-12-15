var express = require('express');
var router = express.Router();

const membersBL = require('../models/Members/memberBL');

const checkPermissions =  require('../middlewares/checkPermissions');

/* GET home page. */
router.get('/', checkPermissions("View Subscriptions"), async function(req, res, next) {
  let members = await membersBL.getMembers();

  res.render('subscriptions/subscriptions', { title: 'Subscriptions Page' , msg: '', members : members});
});

router.get('/new', checkPermissions("Create Subscriptions"), function(req, res, next) {
  res.render('subscriptions/newMember', { title : "Add Member Page"});
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

router.get('/edit/:id', checkPermissions("Update Subscriptions"), async function(req, res, next) {
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
    res.send('An error occured while trying to gey the member: ${memberId} data');
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
    let members = await membersBL.getMembers();
    if(members){
      res.render('subscriptions/subscriptions', { title : "Member Page", msg : answer.msg, members: members});  
    }
    else{
      res.send('member Updated, but an error occured while trying to get all members');
    }

  }
  else{
    //genereal error
    //res.send('An error occured while trying to save the member');
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
    //res.send('An error occured while trying to delete the member');
    res.render('error', {message: 'An error occured while trying to delete the member', page: "subscriptions"});
  }

});


module.exports = router;
