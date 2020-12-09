var express = require('express');
var router = express.Router();

const passport = require('passport');
const { runInNewContext } = require('vm');

router.get('/', function(req, res, next) {
  req.session.user = null;
  res.render('index', { title: 'Cinema Web Site'});
});

module.exports = router;
