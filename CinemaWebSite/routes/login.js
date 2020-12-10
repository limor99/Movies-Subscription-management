var express = require('express');
var router = express.Router();

const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // if login failed
  let message = req.flash('error');
  
  res.render('login', { data : 'Login Page', message});
});

module.exports = router;
