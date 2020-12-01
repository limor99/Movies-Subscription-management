var express = require('express');
var router = express.Router();

const passport = require('passport');



/* GET users listing. */
router.post('/', passport.authenticate('local', {session : false}), function(req, res, next) {
  res.render('main', {title: "Main Page"})
});

module.exports = router;
