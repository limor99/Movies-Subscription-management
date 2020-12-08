var express = require('express');
var router = express.Router();

const passport = require('passport');
const { response } = require('../app');

const userBL = require('../models/usersBL');



/* GET users listing. */
router.post('/', passport.authenticate('local'), async function(req, res, next) {
  //let userName = await userBL.getUserName(req.session.passport.user);
  let user = await userBL.getUserById(req.session.passport.user);
  req.session.user = user;
  
  res.render('main', {title: "Main Page"})
});

module.exports = router;
