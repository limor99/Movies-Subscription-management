const express = require('express');

const router = express.Router();

const membersBL = require('../models/membersBL');

router.route('/').get(async function(req, resp){
    let members = await membersBL.getMembersFromDB();

    let success = false, msg = '';

    if(members != null){
        success = true;
      }else{
        msg = 'An error occurred while trying to get all members';
      }
    
      let result = {
        "success": success,
        "msg": msg, 
        "members" : members
      }
    
      resp.json(result);
      
});

router.route('/').post(async function (req, resp){
    let name = req.body.name;
    let email = req.body.email;
    let city = req.body.city;
    
    let newMember = {
        "name" : name,
        "email" : email, 
        "city" : city
    }


    let createdMember = await membersBL.addMember(newMember);
    
    let success = false, msg;
    

    if(createdMember != null){
        success = true;
        msg = 'The member was saved successfully';
    }else{
        msg = 'An error occurred while saving the member';
    }

    let result = {
        "success": success,
        "msg": msg
    }

    resp.json(result);
});

router.route('/:id').get(async function(req, resp){
    let id = req.params.id;
    let success = false, msg = '';
    let member = await membersBL.getMemberById(id);
      
    if(member != null){
      success = true;
    }else{
      msg = 'An error occurred while trying to get member: ${id} data';
    }
  
    let result = {
      "success": success,
      "msg": msg, 
      "member" : member
    }
  
    resp.json(result);
    
  });


    
router.route('/:id').put(async function(req, resp) {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let city = req.body.city;
      
    let member = {
      "name" : name,
      "email" : email, 
      "city" : city
    }
  
    let updateMember = await membersBL.updateMember(id, member);
      
    let success = false, msg;
    
    if(updateMember != null){
      success = true;
      msg = 'The member was update successfully';
    }else{
      msg = 'An error occurred while updateing the member';
    }
  
    let result = {
      "success": success,
      "msg": msg,
      "member": member
    }
  
    resp.json(result);
});

router.route('/:id').delete(async function(req, resp) {
    let id = req.params.id;
    
    let deletedMember = await membersBL.deleteMember(id);
      
    let success = false, msg;
    
    if(deletedMember != null){
      success = true;
      msg = 'The member was deleted';
    }else{
      msg = `An error occurred while try to delete the member: ${id}`;
    }
  
    let result = {
      "success": success,
      "msg": msg,
    }
  
    resp.json(result);
     
});

module.exports = router;