var router = require('express').Router();


var userAuth = require('../controllers/userAuth');

module.exports =  function (app) {
  router.get('/',function(req, res){
    res.send("Hey I am in router");
  });

  router.post('/register', userAuth.register);

  //authenticate user and get a jwt
  router.post('/login',userAuth.login);

  router.post('/logout',userAuth.logout);

  router.post('/authenticate',userAuth.authenticate);

  app.use(router);
}
