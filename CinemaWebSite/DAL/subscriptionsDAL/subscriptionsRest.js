const axios = require('axios');
const subscriptionRestUrl = 'http://localhost:8000/api/subscriptions/';

exports.getSubscriptions = async function(){
    let resp = null;
    try{
        resp = await axios.get(subscriptionRestUrl)
    }catch(err){
        console.log(`An error occured while try to get all subscriptions from rest api: ${err}`)
    }
    
    return resp;
}

exports.deleteMovieSubscribers = async function(movieId){
    let resp = null;
    try{
        resp = await axios.delete(`${subscriptionRestUrl}${movieId}`)
    }
    catch(err){
        console.log(`An error occured while try to delete subscriptions to movie ${movieId} from rest api: ${err}`)
    }
    finally{
        return resp;
    }
}

exports.subscribeToMovie = async function(subscribeMovie){
    let resp = null;
    try{
        resp = await axios.post(subscriptionRestUrl, subscribeMovie);
    }
    catch(err){
        console.log(`An error occured while try to add subscriptions to movie ${subscribeMovie.subscribeMovieId} to user ${subscribeMovie.memberId} in rest api: ${err}`)
    }
    finally{
        return resp;
    }
}