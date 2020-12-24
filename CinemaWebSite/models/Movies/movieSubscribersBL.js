const movieBL = require('../Movies/moviesBL');
const memberBL = require('../Members/memberBL');
const subscriberBL = require('../Members/subscribeBL');

exports.getMoviesSubscribers = async  function(){
    let movies = await movieBL.getMovies();
    let members = await memberBL.getMembers();
    let subscribers = await subscriberBL.getSubscribers();

    if(movies != null && members != null && subscribers != null){
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


}

