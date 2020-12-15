const express = require('express');
const router = express.Router();

const moviesBL = require('../models/moviesBL');

router.route('/').get(async function(req, resp){
  let allMovies = await moviesBL.getMoviesFromDB();
  let success = false, msg = '';
  

  if(allMovies != null){
    success = true;
  }else{
    msg = 'An error occurred while trying to get all movies';
  }

  let result = {
    "success": success,
    "msg": msg, 
    "movies" : allMovies
  }

  resp.json(result);
  
})

router.route('/:id').get(async function(req, resp){
  let id = req.params.id;
  let success = false, msg = '';
  let movie = await moviesBL.getMovieById(id);
    
  if(movie != null){
    success = true;
  }else{
    msg = 'An error occurred while trying to get movie: ${id} data';
  }

  let result = {
    "success": success,
    "msg": msg, 
    "movie" : movie
  }

  resp.json(result);
  
})

router.route('/').post(async function(req, resp) {
  let name = req.body.name;
  let genres = req.body.genres;
  let mediumImage = req.body.image.medium;
  let originalImage = req.body.image.original;
  let premiered = req.body.premiered;

  let newMovie = {
    "name" : name,
    "genres" : genres, 
    "image" : {
      "medium" : mediumImage,
      "original" : originalImage
      }, 
    "premiered" : premiered
  }

  console.log("post")

  let createdMovie = await moviesBL.addMovie(newMovie);
  console.log("11111: " + createdMovie)

  let success = false, msg;
  

  if(createdMovie != null){
    success = true;
    msg = 'The movie was saved successfully';
  }else{
    msg = 'An error occurred while saving the movie';
  }

  let result = {
    "success": success,
    "msg": msg
  }

  console.log(result)
  resp.json(result);
   
  });


  
router.route('/:id').put(async function(req, resp) {
  let id = req.params.id;
  let name = req.body.name;
  let genres = req.body.genres;
  let mediumImage = req.body.image.medium;
  let originalImage = req.body.image.original;
  let premiered = req.body.premiered;

  let movie = {
    "name" : name,
    "genres" : genres, 
    "image" : {
      "medium" : mediumImage,
      "original" : originalImage
      }, 
    "premiered" : premiered
  }

  let updateMovie = await moviesBL.updateMovie(id, movie);
  let success = false, msg;
  
  if(updateMovie != null){
    success = true;
    msg = 'The movie was update successfully';
  }else{
    msg = 'An error occurred while updateing the movie';
  }

  let result = {
    "success": success,
    "msg": msg,
    "movie": movie
  }

  resp.json(result);
   
});


  router.route('/:id').delete(async function(req, resp) {
    let id = req.params.id;
    
    let deletedMovie = await moviesBL.deleteMovie(id);
      
    let success = false, msg;
    
  
    if(deletedMovie != null){
      success = true;
      msg = 'The movie was deleted';
    }else{
      msg = `An error occurred while try to delete the movie: ${id}`;
    }
  
    let result = {
      "success": success,
      "msg": msg,
    }
  
    resp.json(result);
     
  });
  
  module.exports = router;