const express = require('express');
const router = express.Router();

const subscriptionsBL = require('../models/subscriptionsBL');
const { route } = require('./moviesRouter');

router.route('/').get(async function(req, resp){
    let subscriptions = await subscriptionsBL.getSubscriptions();
    let success = false, msg = '';

    if(subscriptions != null){
        success = true;
    }
    else{
        msg = "An error occurred while trying to get all subscriptions";
    }

    let result = {
        "success": success,
        "msg": msg, 
        "subscriptions" : subscriptions
      }
   
      resp.json(result);
})

router.route('/:id').delete(async function(req, resp){
    let movieId = req.params.id;

    let deletedSubscribesMovie = await subscriptionsBL.deletedSubscribeMovies(movieId);
    let success = false, msg = '';

    if(deletedSubscribesMovie != null){
        success = true;
    }
    else{
        msg = `An error occurred while trying to delete subscribe's movie: ${movieId}`;
    }

    let result = {
        "success": success,
        "msg": msg
    }

    resp.json(result);


})

router.route("/").post(async function(req, resp){
    let memberId = req.body.memberId;
    let subscribeMovieId = req.body.subscribeMovieId;
    let watchedDate = req.body.watchedDate;

    let subscribeMovie = {
        memberId,
        subscribeMovieId,
        watchedDate
    }

    let subscription = await subscriptionsBL.subscribeToMovie(subscribeMovie);

    let success = false, msg = '';

    if(subscription != null){
        success = true;
    }
    else{
        msg = `An error occured while try to add/update subscribe to movie: ${subscribeMovie.subscribeMovieId} for member ${subscribeMovie.memberId} in db`;
    }

    let result = {
        "success": success,
        "msg": msg
    }

    resp.json(result);

})

module.exports = router;
