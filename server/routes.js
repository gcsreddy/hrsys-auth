var router = require('express').Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');
var UserAcct = require('../models/user');
var opts = require('./config').opts;

var userAuth = require('../controllers/userAuth');

module.exports =  function (app) {
  router.get('/',function(req, res){
    res.send("Hey I am in router");
  });

  router.post('/register', userAuth.register);

  //authenticate user and get a jwt
  router.post('/login',userAuth.login);

  router.get('/authenticate',
    passport.authenticate('jwt',{session:false}),
    function(req, res){
      console.log("heyy I am authenticated in dashboard");
      res.json({success:"true", location:"dashboard"});
  });

  app.use(router);
}
