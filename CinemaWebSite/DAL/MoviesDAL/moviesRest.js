//const { request } = require("express")
const moviesRestUrl = 'http://localhost:8000/api/movies/';

const axios = require('axios');

exports.addMovie = async function(movie){
    let resp = null;
    try{
        resp = await axios.post(`${moviesRestUrl}`, movie);
    }
    catch(err){
        console.log(`An error occured while try to add new movie by rest api: ${err}`);
    }
    finally{
        return resp;
    }
    
}

exports.getMovies = async function(){
    let resp = null;
    try{
        resp = await axios.get(moviesRestUrl);
    }
    catch(err){
        console.log(`An error occured while try to get all movies from rest api: ${err}`)
    }
    finally{
        return resp;
    }
}

exports.updateMovie = async function(movie){
    let resp = null;
    try{
        resp = await axios.put(`${moviesRestUrl}${movie.id}`, movie);
    }
    catch(err){
        console.log(`An error occured while try to update movie: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }
}

exports.deleteMovie = async function(id){
    let resp = null;
    try{
        resp = await axios.delete(`${moviesRestUrl}${id}`);
    }catch(err){
        console.log(`An error occured while try to delete movie: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }
}

exports.getMovieById = async function(id){
    let resp = null;
    try{
        resp = await axios.get(`${moviesRestUrl}${id}`);
    }
    catch(err){
        console.log(`An error occured while try to get movie: ${id} by rest api: ${err}`);
    }
    finally{
        return resp;
    }

}

exports.searchMovie = async function(text){
    let resp = null;
    try{
        resp = await axios.get(`${moviesRestUrl}search/${text}`);
    }
    catch(err){
        console.log(`An error occured while try to get movie with: ${text} by rest api: ${err}`);
    }
    finally{
        return resp;
    }

}