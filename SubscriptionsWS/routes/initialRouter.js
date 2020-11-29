const express = require('express');

const membersBL = require('../models/membersBL');
const moviesBL = require('../models/moviesBL');
const initialBL = require('../models/initialBL');

const router = express.Router();

router.route('/').get(async function(req, resp){
    let members = await membersBL.getMemebers();
   let movies = await moviesBL.getMovies();
   resp.json(movies);
   //let resukt = await initialBL.initDB();
})

module.exports = router;
