const membersRest = require('../../DAL/MembersDAL/membersRest');

exports.getMembers = async function(){
    let data = null;
    let members = null;

    let answer = await membersRest.getMembers();

    if(answer != null){
        data = answer.data;
        if(data.success){
            members = data.members;
        }
    }

    return members;
}

exports.addMember = async function(member){
    let data = null;

    let answer = await membersRest.addMember(member);

    if(answer != null){
        data = answer.data;
    }

    return data;

}

exports.getMemberById = async function(memberId){
    let data = null;

    let answer = await membersRest.getMemberById(memberId);

    if(answer != null){
        data = answer.data;
    }

    return data;
}

exports.updateMember = async function(member){
    let data = null;

    let answer = await membersRest.updateMember(member);

    if(answer != null){
        data = answer.data;
    }

    return data;

}

exports.deleteMember = async function(id){
    let data = null;

    let answer = await membersRest.deleteMember(id);
        
    if(answer != null){
        data = answer.data;
    }

    return data;
}