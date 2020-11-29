const membersDL = require('../DAL/membersRest');
const Member = require('./memberModel');

exports.getMemebers = async function(){
    let members = await membersDL.getMemebers();
    let data = members.data;

    let memeberData = data.map(x => {
        let obj = {
            "name": x.name,
            "email": x.email,
            "city": x.address.city
        }
        return obj
    })

    return memeberData;
}

exports.getMembersFromDB = async function(){
    let members = null;
    try{
        members = await Member.find({})
    }
    catch(err){
        console.log(`An error occured while try to get all members from db: ${err}`);
    }
    finally{
        return members;
    }
}

exports.addMember = async function(member){
    let createdMember = null;
    try{
        let newMember = new Member(member);
        createdMember = await newMember.save();
    }
    catch(err){
        console.log("An error occured while try to add new member to DB (members collection): "  + err);
    }
    finally{
        return createdMember;
    }

}

exports.getMemberById = async function(id){
    let member = null;
    try{
        member = await Member.findById(id);
    }
    catch(err){
        console.log(`An error occured while try to get member: ${id} data: ${err}`);
    }
    finally{
        return member;
    }
    
}

exports.updateMember = async function(id, member){
    let updateMember = null;
    try{
        updateMember = await Member.findByIdAndUpdate(id, member);
    }
    catch(err){
        console.log("An error occured while try to update member in DB (member collection): "  + err);
    }
    finally{
        return updateMember;
    }

}

exports.deleteMember = async function(id){
    let deletedMember = null;
    try{
        deletedMember = await Member.findByIdAndDelete(id);
    }
    catch(err){
        console.log(`An error occured while try to delete member: ${id} in DB (members collection): ${err}`);
    }
    finally{
        return deletedMember;
    }

}
