const subscribeRest = require('../../DAL/subscriptionsDAL/subscriptionsRest');

exports.getSubscribers = async function(){
    let data = null;
    let subscribers = null;

    let answer = await subscribeRest.getSubscriptions();

    if(answer != null){
        data = answer.data;
        if(data.success){
            subscribers = data.subscriptions;
        }
    }

    return subscribers;
}

exports.deleteMovieSubscribers = async function(movieId){
    let data = null;

    let answer = await subscribeRest.deleteMovieSubscribers(movieId);
        
    if(answer != null){
        data = answer.data;
    }

    return data;
}

