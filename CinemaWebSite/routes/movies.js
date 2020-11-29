var express = require('express');
var router = express.Router();

const moviesBL = require('../models/Movies/moviesBL');

/* GET mobvies listing. */
router.get('/', async function(req, res, next) {
  let movies = await moviesBL.getMovies();
  
  res.render('movies/movies', { title : "Movies Page", msg: '', movies : movies});
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
    let movies = await moviesBL.getMovies();
    if(movies){
      res.render('movies/movies', { title : "Movies Page", msg : answer.msg, movies: movies});  
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


  if(answer != null){
    let movies = await moviesBL.getMovies();
    if(movies){
      res.render('movies/movies', { title : "Movies Page", msg : answer.msg, movies: movies});  
    }
    else{
      res.send('movie Updated, but an error occured while trying to get all movies');
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to save the movie');
  }

});

router.get('/delete/:id', async function(req, res, next) {
  let movieId = req.params.id
  
  let answer = await moviesBL.deleteMovie(movieId);


  if(answer != null){
    let movies = await moviesBL.getMovies();
    if(movies){
      res.render('movies/movies', { title : "Movies Page", msg : answer.msg, movies: movies});  
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


router.get('/new', function(req, res, next) {
  res.render('movies/newMovie', { title : "Add Movies Page"});
});

router.get('/edit/:id', async function(req, res, next) {
  let movie = null;
  let movieId = req.params.id;
  
  let answer = await moviesBL.getMovieById(movieId);

  if(answer != null){
    if(answer.success){
      movie = answer.movie;
      if(movie.premiered){
        movie.premiered = movie.premiered.substring(0, 10);
      }
      
      console.log(movie.premiered);
      res.render('movies/editMovie', { title : "Movies Page", movie : movie});
    }
    else{
      res.send(`An error occured while trying to update movie: ${movieId}`);
    }

  }
  else{
    //genereal error
    res.send('An error occured while trying to gey the movie: ${movieId} data');
  }

});


module.exports = router;
