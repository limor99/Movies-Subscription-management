var express = require('express');
var router = express.Router();

const passport = require('passport');
const { response } = require('../app');

const userBL = require('../models/usersBL');


router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), async function(req, res, next) {
  let user = await userBL.getUserById(req.session.passport.user);
  req.session.user = user;
  res.locals.user = user;

  res.render('main', {title: "Main Page", name: `${user.firstName} ${user.lastName}`, message : ""});
});

module.exports = router;