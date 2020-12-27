const Subscription = require('./subscriptionModel');

exports.getSubscriptions = async function(){
    let allSubscriptions = null;

    try{
        allSubscriptions = await Subscription.find({});

        
    }
    catch(err){
        console.log("An error occured while try to get all subscriptions from db (subscriptions collection)");
    }
    
    return allSubscriptions;

}

exports.deletedSubscribeMovies = async function(movieId){
    let deletedSubscribeMovies = null;

    try{
        deletedSubscribeMovies = await Subscription.updateMany({}, { $pull: { movies: { movieId: movieId}}}, {multi : true})
    }
    catch(err){
        console.log(`An error occured while try to delete subscribe's movie: ${movieId} from db: ${err}`);
    }
    finally{
        return deletedSubscribeMovies;
    }
    
}

exports.subscribeToMovie = async function(subscribeMovie){
    let answer;
    let updatedSubscription;

    let movieSubscription = {
        "memberId" : subscribeMovie.memberId,
        "movies" : [
            {
                "movieId" : subscribeMovie.subscribeMovieId ,
                "date" : subscribeMovie.watchedDate
            }
        ]
    }

    try{Subscription.fin
        let subscriber = await Subscription.findOne({memberId : subscribeMovie.memberId});
        if(subscriber != null){  //member's has subscribe movies so we need update the movies array
            answer = await Subscription.updateOne({memberId : movieSubscription.memberId }, {$push: {movies: {movieId: movieSubscription.movies[0].movieId, date: movieSubscription.movies[0].date }}})
            if(answer.n === 1 && answer.nModified === 1){
                updatedSubscription = movieSubscription;
            }
        }
        else{   //member's has not subscribe movies so we need to add new member and it's movie subscriptions
            let subscription = new Subscription(movieSubscription);
            updatedSubscription = subscription.save();

        }
    }
    catch(err){
        console.log(`An error occured while try to add subscribe to movie: ${subscribeMovie.subscribeMovieId} for member ${subscribeMovie.memberId} in db: ${err}`);
    }
    finally{
        return updatedSubscription;
    }

}