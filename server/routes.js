var router = require('express').Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');
var UserAcct = require('../models/user');
var opts = require('./config').opts;

module.exports =  function (app) {
  router.get('/',function(req, res){
    res.send("Hey I am in router");
  });

  router.post('/register', function(req, res) {
    if(!req.body.email || !req.body.password){
      res.json({
        success:"false",message:"please enter email, password"
      });
    }else{
      var newUserObj = new UserAcct({
        username:req.body.email,
        password:req.body.password
      });
      newUserObj.save(function(err){
        if(err){
          return res.json({
            success:"false",
            message:"user already exist"
          })
        }else{
          res.json({success:"true",message:"new user registered"});
        }
      });
    }
  });

  //authenticate user and get a jwt
  router.post('/authenticate',function(req, res){
    //console.log(req.body);
    if(!req.body.email || !req.body.password){
      res.json({
        success:"false",message:"please enter email, password"
      });
    }else{
      //find user and compare password
      UserAcct.findOne({username:req.body.email}, function(err, userAcc){
        if(err){
          throw err;
        }
        if(!userAcc){
          res.json({
            success:"false",
            message:"user not found"
          });
        }else {
          //check if the password matches
          userAcc.comparePassword(req.body.password, function(err,matched){
            if(err){
              throw err;
            }
            if(matched){
              //https://github.com/auth0/node-jsonwebtoken
              var token =jwt.sign(
                userAcc,
                opts.secretOrKey,
                {expiresIn:1800000}
              );
              res.json({
                success:"true",
                authenticated:"true",
                message:"user authenticated successfully",
                token:'JWT '+token
              });
            }else{
              res.json({
                success:"false",
                message:"incorrect username and password"
              });
            }
          });
        }

      });
    }
  });

  router.get('/dashboard',
    passport.authenticate('jwt',{session:false}),
    function(req, res){
      console.log("heyy I am authenticated in dashboard");
      res.json({success:"true", location:"dashboard"});
  });

  app.use(router);
}
