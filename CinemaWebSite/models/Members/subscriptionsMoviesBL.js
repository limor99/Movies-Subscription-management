const memberBL = require('./memberBL');
const subscriptionsRest = require('../../DAL/subscriptionsDAL/subscriptionsRest');
const moviesBL = require('../Movies/moviesBL');
const subscriptionsBL = require('../Members/subscribeBL');


exports.getSubscriptionsMovies = async function(){
    let subscriptionsMovies = null;
    let members = await memberBL.getMembers();
    let subscriptions = await subscriptionsBL.getSubscribers();
    let movies = await moviesBL.getMovies();

    if(members && subscriptions && movies)
    {
        subscriptionsMovies = members.map(member =>{
            let memberSubscribesMovies;  //all movies the member watched already (the movie's id and watched date)
            let memberMovies;   //all movies the member watched already (include the movie's data)
            let subscribeMoviesIds = [];    //all the subscribes's movies id (for member)
            let unsubscribedMovies = [];    //unwatched movies for member
            let subscription = subscriptions.filter(s => s.memberId === member._id);
            if(subscription.length > 0){
                memberSubscribesMovies = subscription[0].movies;
                let movie;

                if(memberSubscribesMovies != undefined){
                    memberMovies = memberSubscribesMovies.map(mi =>{
                        subscribeMoviesIds.push(mi.movieId)
                        movie = movies.filter(m => mi.movieId === m._id);
                        if(movie.length > 0){
                            return {
                                "movieId" : movie[0]._id,
                                "movieName" : movie[0].name,
                                "watchDate" : mi.date
                            }

                        }
                        
                    })
                    
                    movies.forEach(m => {
                        if(!subscribeMoviesIds.includes(m._id)){
                            let unsubscribedMovie = {
                                "_id" : m._id,
                                "name" : m.name
                            }
                            
                           unsubscribedMovies = [...unsubscribedMovies, unsubscribedMovie];
                        }
                    });
                }
            }
            else{
                unsubscribedMovies = movies;
            }

            return {
                "id" : member._id,
                "name" : member.name,
                "email" : member.email,
                "city" : member.city,
                "movies" : memberMovies !== undefined ? memberMovies : [],
                "unwatched" : unsubscribedMovies
            }
        })
    }

    return subscriptionsMovies;
}

exports.subscribeToMovie = async function(subscribeMovie){
    let data;
    
    let answer = await subscriptionsRest.subscribeToMovie(subscribeMovie);
    if(answer != null){
        data = answer.data;
    }

    return data;

}
