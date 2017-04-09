var jwt = require('jsonwebtoken');
var mypassport = require('../server/passport');
var UserAcct = require('../models/user');
var opts = require('../server/config').opts;
var passport = require('passport');
module.exports = {

  register :function(req, res) {
    if(!req.body.email || !req.body.password){
      res.json({
        success:"false",message:"please enter email, password"
      });
    }else{
      var newUserObj = new UserAcct({
        username:req.body.email,
        password:req.body.password,
        loggedin:true
      });
      newUserObj.save(function(err){
        if(err){
          console.log('error registering'+err);
          return res.json({
            success:"false",
            message:"user already exist"
          })
        }else{
          res.json({success:"true",message:"new user registered"});
        }
      });
    }
  },

  authenticate :[passport.authenticate('jwt',{session:false}),
  function(req, res){
    //if this function gets called, authentication is successful.
    //`req.user` contains the authenticated user
    //see passportjs.org/docs/authenticate

    //check if user has logged out before?
    UserAcct.findOne(
      {username:req.user[0].username},
      function(err, user){
      if(err){
        throw err;
      }
      //console.log(user);
      //console.log("heyy I am authenticated in dashboard");
      if(user && user.loggedin){
        res.json({success:"true"});
      }else{
        res.json({success:"false"});
      }

    });

  }],

  login : function(req, res){
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
              console.log("in login");
              console.log(userAcc);
              UserAcct.findOneAndUpdate(
                {username:req.body.email},
                {loggedin:true},
                function(err) {
                  if(err){
                    throw err;
                  }
                }
              );
              var token =jwt.sign(
                userAcc,
                opts.secretOrKey,
                {expiresIn:1800}
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
  },

  logout : [passport.authenticate('jwt',{session:false}),
  function(req, res){
    //ignore if authentication fails.
    //here authentication is successful
    //update database to set loggedin flag to false
    //console.log(req.user[0]);
    let query = {username:req.user[0].username};
    console.log('query='+query.username);
    UserAcct.findOneAndUpdate(
      query,
      {$set:{loggedin:false}},
      {new:true},
      function(err,updatedUser) {
        if(err){
          throw err;
        }
        //console.log(updatedUser);
      }
    );
    res.json({success:"true", location:"dashboard"});
  }]

}
