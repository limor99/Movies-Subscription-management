const memberBL = require('./memberBL');
const subscriptionsRest = require('../../DAL/subscriptionsDAL/subscriptionsRest');
const moviesBL = require('../Movies/moviesBL');


exports.getSubscriptionsMovies = async function(){
    let subscriptionsMovies = null;
    let data = null;
    let subscriptions = null;
    let members = await memberBL.getMembers();
    let answer = await subscriptionsRest.getSubscriptions();
    let movies = await moviesBL.getMovies();

    if(answer != null){
        data = answer.data;
        if(data.success){
            subscriptions = data.subscriptions;
        }
    }

    if(members && subscriptions && movies)
    {
        subscriptionsMovies = members.map(member =>{
            let memberSubscribesMovies;  //all the subscribes movies's (for user)
            let memberMovies;   //all unwatched movies (for user)
            let subscribeMoviesIds = []; //all the subscribes movies's id (for user)
            let unsubscribedMovies = [];
            let memberMovieId = subscriptions.filter(s => s.memberId === member._id);
            if(memberMovieId.length > 0){
                memberSubscribesMovies = memberMovieId[0].movies;
                let movie;

                if(memberSubscribesMovies != undefined){
                    memberMovies = memberSubscribesMovies.map(mi =>{
                        subscribeMoviesIds.push(mi.movieId)
                        movie = movies.filter(m => mi.movieId === m._id);
                        if(movie.length > 0){
                            return {
                                "movieId" : movie[0]._id,
                                "movieName" : movie[0].name,
                                "moviePremiered" : movie[0].premiered
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
/*
                    movies.forEach(m =>{
                        let unwatched = moviesIds.filter(mi => mi.movieId !== m._id);
                        if(unwatched.length > 0){
                            let unsubscribedMovie = {
                                "_id" : m._id,
                                "name" : m.name
                            }
                            
                           unsubscribedMovies = [...unsubscribedMovies, unsubscribedMovie];
                        }
                       // return unwatched;
                    })
                    */
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
