var express = require('express');
var router = express.Router();

const passport = require('passport');
const { response } = require('../app');

const userBL = require('../models/Users/usersBL');


router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), async function(req, res, next) {
  let user = await userBL.getUserById(req.session.passport.user);
  req.session.user = user;
  let userSessionTimeout = user.sessionTimeOut;
  req.session.cookie.expires = new Date(Date.now() + userSessionTimeout * 60 * 60);
  res.locals.user = user;

  res.render('main', {title: "Main Page", name: `${user.firstName} ${user.lastName}`, message : ""});
});

module.exports = router;