const movieRest = require('../../DAL/MoviesDAL/moviesRest');

exports.addMovie = async function(movie){
    let data = null;

    let answer = await movieRest.addMovie(movie);

    if(answer != null){
        data = answer.data;
    }

    return data;

}

exports.getMovies = async function(){
    let data = null;
    let movies = null;

    let answer = await movieRest.getMovies();

    if(answer != null){
        data = answer.data;
        if(data.success){
            movies = data.movies;
        }
    }

    return movies;
}


exports.updateMovie = async function(movie){
    let data = null;

    let answer = await movieRest.updateMovie(movie);

    if(answer != null){
        data = answer.data;
    }

    return data;

}

exports.deleteMovie = async function(id){
    let data = null;

    let answer = await movieRest.deleteMovie(id);

    
    if(answer != null){
        data = answer.data;
    }

    return data;



}


//fix!!!
exports.getMovieById = async function(movieId){
    let data = null;

    let answer = await movieRest.getMovieById(movieId);

    if(answer != null){
        data = answer.data;
    }

    return data;


}
    