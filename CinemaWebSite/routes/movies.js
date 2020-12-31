const { request } = require('express');
var express = require('express');
var router = express.Router();

const moviesBL = require('../models/Movies/moviesBL');
const subscribeBL = require('../models/Members/subscribeBL');
const movieSubscriberBL = require('../models/Movies/movieSubscribersBL');

const checkPermissions =  require('../middlewares/checkPermissions');

/* GET mobvies listing. */
router.get('/', checkPermissions("View Movies"), async function(req, res, next) {
  let moviesSubscribed = await movieSubscriberBL.getAllMovies();
  
  if(moviesSubscribed){
    res.render('movies/movies', { title : "Movies Page", msg: '', moviesSubscribed : moviesSubscribed});
  }
  else{
    res.send('An error occured while trying to get all movies');
  }
  
});

router.post('/new/add', async function(req, res, next) {
  let name = req.body.name;
  let genres = req.body.genres;
  let url = req.body.imageUrl;
  let premiered = req.body.premiered;

  let newMovie = {
    "name" : name,
    "genres" : genres, 
    "image" : {
              "medium" : url,
              "original" : ''
              },
    "premiered" : premiered
  }

  let answer = await moviesBL.addMovie(newMovie);
  
  if(answer != null){
    //let movies = await moviesBL.getMovies();
    let moviesSubscribed = await movieSubscriberBL.getAllMovies();
    if(moviesSubscribed){
      res.render('movies/movies', { title : "Movies Page", msg : answer.msg, moviesSubscribed: moviesSubscribed});  
    }
    else{
      res.send('movie added, but an error occured while trying to get all movie');
    }
  }
  else{
    //genereal error
    res.send('An error occured while trying to save the movie');
  }
  

});

router.post('/update', async function(req, res, next) {
  let movieId = req.body.id;
  let name = req.body.name;
  let genres = req.body.genres;
  let url = req.body.imageUrl;
  let premiered = req.body.premiered;

  let movie = {
    "id" : movieId,
    "name" : name,
    "genres" : genres, 
    "image" : {
              "medium" : url,
              "original" : ''
              },
    "premiered" : premiered
  }

  let answer = await moviesBL.updateMovie(movie);


  if(answer != null && answer.success){
    let moviesSubscribed = await movieSubscriberBL.getAllMovies();
    
    if(moviesSubscribed){
      res.render('movies/movies', { title : "Movies Page", msg : answer.msg, moviesSubscribed: moviesSubscribed});  
    }
    else{
      res.send('movie Updated, but an error occured while trying to get all movies');
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to save the movie');
  }


  console.log("end post update")
});

router.get('/new', checkPermissions("Create Movies"), function(req, res, next) {
  res.render('movies/newMovie', { title : "Add Movies Page"});
});

router.get('/edit/:id', checkPermissions("Update Movies"), async function(req, res, next) {
  let movie = null;
  let movieId = req.params.id;
  
  let answer = await moviesBL.getMovieById(movieId);

  if(answer != null){
    if(answer.success){
      movie = answer.movie;
      if(movie.premiered){
        movie.premiered = movie.premiered.substring(0, 10);
      }
      
      res.render('movies/editMovie', { title : "Movies Page", movie : movie});
    }
    else{
      res.send(`An error occured while trying to update movie: ${movieId}`);
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to get the movie: ${movieId} data');
  }

});

router.get('/delete/:id', checkPermissions("Delete Movies"), async function(req, res, next) {
  let movieId = req.params.id;

  let answer1 = await subscribeBL.deleteMovieSubscribers(movieId);
  
  let answer2 = await moviesBL.deleteMovie(movieId);


  if(answer1 != null && answer1.success && answer2 != null && answer2.success){
    let moviesSubscribed = await movieSubscriberBL.getAllMovies();
    if(moviesSubscribed){
      res.render('movies/movies', { title : "Movies Page", msg : answer2.msg, moviesSubscribed: moviesSubscribed});  
    }
    else{
      res.send('movie deleted, but an error occured while trying to get all movies');
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to delete the movie');
  }

});

router.get('/:id', checkPermissions("View Movies"), async function(req, res, next) {
  let id = req.params.id;
  let response = await moviesBL.getMovieById(id);
  
  if(response.success){
    let movie = response.movie;
    res.render('movies/movie', { title : "Movie Page", msg: '', movie : movie});
  }
  else{
    res.render('main', { title : "Main Page", msg: '', message: `An error occured while try get movie's data. movie's id: ${id}`});
  }
  
});

router.post('/search', checkPermissions("View Movies"), async function(req, res, next) {
  let searchText = req.body.search;

  let searchResult = await movieSubscriberBL.searchMovie(searchText);

  if(searchResult){
    res.render('movies/movies', { title : "Search Result", msg: '', moviesSubscribed : searchResult});
  }
  else{
    res.send(`An error occured while trying to get movie's search: ${searchText}`);
  }

});

module.exports = router;
