const axios = require('axios');

const moviesUrl = 'https://api.tvmaze.com/shows';

exports.getMovies = async function(){
    return axios.get(moviesUrl);
}