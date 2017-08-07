var JwtStrategy = require('passport-jwt').Strategy;
var opts = require('./config').opts;
console.log(opts);
var UserAcct = require('../models/user');

module.exports= function(passport) {
  //verify will be a func with params jwt_payload, done
  passport.use(new JwtStrategy(opts,function(jwt_payload, done){
    //https://jwt.io/ paste the jwt to see payload props

    UserAcct.find({_id:jwt_payload._id},function(err,user){
      if(err){
        return done(err, false);
      }
      if(user){
        console.log(user);
        return done(null, user);
      }else{
        return done(null, false);
        // TODO could have created a new account here
      }
    });
  }));
}
