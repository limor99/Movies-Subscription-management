const axios = require('axios');

const membersRestUrl = 'https://jsonplaceholder.typicode.com/users';


exports.getMemebers = function(){
    return axios.get(membersRestUrl)
}