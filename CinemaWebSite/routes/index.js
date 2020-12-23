var express = require('express');
var router = express.Router();


//delete
const usersBL = require('../models/Users/usersBL');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cinema Web Site' });

  
});

module.exports = router;
