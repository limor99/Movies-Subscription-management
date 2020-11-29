const memberRestUrl = 'http://localhost:8000/api/members/';
const axios = require('axios');

exports.getMembers = async function(){
    let resp = null;
    try{
        resp = await axios.get(memberRestUrl)
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
        resp = await axios.post(memberRestUrl, member);
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
        resp = await axios.get(`${memberRestUrl}${id}`);
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
        resp = await axios.put(`${memberRestUrl}${member.id}`, member);
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
        resp = await axios.delete(`${memberRestUrl}${id}`);
    }catch(err){
        console.log(`An error occured while try to delete member: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }
}