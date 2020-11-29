var express = require('express');
var router = express.Router();

const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { data : 'Login Page'});
});

module.exports = router;
