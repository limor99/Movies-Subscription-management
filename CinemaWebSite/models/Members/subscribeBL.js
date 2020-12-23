const subscribeRest = require('../../DAL/subscriptionsDAL/subscriptionsRest');

exports.deleteMovieSubscribers = async function(movieId){
    let data = null;

    let answer = await subscribeRest.deleteMovieSubscribers(movieId);
        
    if(answer != null){
        data = answer.data;
    }

    return data;
}