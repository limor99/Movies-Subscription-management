const membersRestUrl = 'http://localhost:8000/api/members/';
const axios = require('axios');

exports.getMembers = async function(){
    let resp = null;
    try{
        resp = await axios.get(membersRestUrl)
    }catch(err){
        console.log(`An error occured while try to get all members from rest api: ${err}`)
    }
    finally{
        return resp;
    }
}

exports.addMember = async function(member){
    let resp = null;
    try{
        resp = await axios.post(membersRestUrl, member);
    }
    catch(err){
        console.log(`An error occured while try to add new member by rest api: ${err}`);
    }
    finally{
        return resp;
    }
    
}

exports.getMemberById = async function(id){
    let resp = null;
    try{
        resp = await axios.get(`${membersRestUrl}${id}`);
    }
    catch(err){
        console.log(`An error occured while try to get member: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }
}

exports.updateMember = async function(member){
    let resp = null;
    try{
        resp = await axios.put(`${membersRestUrl}${member.id}`, member);
    }
    catch(err){
        console.log(`An error occured while try to update member: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }

}

exports.deleteMember = async function(id){
    let resp = null;
    try{
        resp = await axios.delete(`${membersRestUrl}${id}`);
    }catch(err){
        console.log(`An error occured while try to delete member: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }
}