const moviesDL = require('../DAL/moviesRest');
const Movie =  require('./movieModel');

//get all movies from exteranal Rest api
exports.getMovies = async function(){
    let movies = await moviesDL.getMovies();
    let data = movies.data;

    let moviesData = data.map(x =>{
        let obj = {
            "name": x.name,
            "genres": x.genres,
            "image": x.image,
            "premiered": x.premiered
        }

        return obj;
    })

    return moviesData;
}

//get all movies from internal db
exports.getMoviesFromDB = async function(){
    let allMovies = null;
    try{
        allMovies = await Movie.find({})
    }
    catch(err){
        console.log(`An error occured while try to get all movies from db: ${err}`);
    }
    finally{
        return allMovies;
    }
}

exports.getMovieById = async function(id){
    let movie = null;
    try{
        movie = await Movie.findById(id);
    }
    catch(err){
        console.log(`An error occured while try to get movie: ${id} data: ${err}`);
    }
    finally{
        return movie;
    }
}

exports.searchMovies = async function(text){
    let movies = null;
    try{
        movies = await Movie.find({name:{ $regex: '.*' + text + '.*' } })
    }
    catch(err){
        console.log(`An error occured while try to get movie data: ${text}: ${err}`);
    }
    finally{
        return movies;
    }

}

//add movie to db
exports.addMovie = async function(movie){
    let createdMovie = null;
    try{
        let newMovie = new Movie(movie);
        createdMovie = await newMovie.save();
    }
    catch(err){
        console.log("An error occured while try to add new movie to DB (movies collection): "  + err);
    }
    finally{
        return createdMovie;
    }
}

//add movie to db
exports.updateMovie = async function(id, movie){
    let updateMovie = null;
    try{
        updateMovie = await Movie.findByIdAndUpdate(id, movie);
    }
    catch(err){
        console.log("An error occured while try to update movie in DB (movies collection): "  + err);
    }
    finally{
        return updateMovie;
    }
}

exports.deleteMovie = async function(id){
    let deletedMovie = null;
    try{
        deletedMovie = await Movie.findByIdAndDelete(id);
    }
    catch(err){
        console.log(`An error occured while try to delete movie: ${id} in DB (movies collection): ${err}`);
    }
    finally{
        return deletedMovie;
    }
}
