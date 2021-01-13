const movieBL = require('../Movies/moviesBL');
const memberBL = require('../Members/memberBL');
const subscriberBL = require('../Members/subscribeBL');

exports.getAllMovies = async  function(){
    let movies = await movieBL.getMovies();
    let members = await memberBL.getMembers();
    let subscribers = await subscriberBL.getSubscribers();
    let moviesSubscribers = null;

    if(movies != null && members != null && subscribers != null){
        moviesSubscribers = getMoviesSubscribers(movies, members, subscribers);
    }

    return moviesSubscribers;
}

exports.getMovieSubscribersById = async function(movieId){
    let allMovies = await this.getAllMovies();
    let movie = allMovies.filter(m => m.movieId === movieId)[0];

    return movie;
}


exports.searchMovie = async function(text){
    let searchMovieResult = await movieBL.searchMovie(text);
    let members = await memberBL.getMembers();
    let subscribers = await subscriberBL.getSubscribers();

    let searchResult = null;

    if(searchMovieResult != null && members != null && subscribers != null){
        searchResult = getMoviesSubscribers(searchMovieResult, members, subscribers);
    }

    return searchResult;

}

function getMoviesSubscribers(movies, members, subscribers){
    let moviesSubscribers = movies.map(m => {
        let subscriberToMovie = [];
        subscribers.forEach(s =>{
            
            let subscribedMovies = s.movies;
            subscribedMovies.forEach(sm =>{
                if(sm.movieId === m._id){
                    let memberName;
                    let memberId = s.memberId;
                    let member = members.filter(mem => mem._id === memberId);
                    if(member.length > 0){
                        memberName = member[0].name;

                        let subscribe = {
                            memberId : memberId,
                            memberName : memberName,
                            dateWatched : sm.date
                        }

                        subscriberToMovie.push(subscribe);
                    }
                }
            })
        })

        return{
            movieId : m._id,
            movieName : m.name,
            moviePremiered : m.premiered,
            movieGenres : m.genres,
            movieImage : m.image.medium,
            subscriberToMovie

        }
    })
    
    return moviesSubscribers;

}



