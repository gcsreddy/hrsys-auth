var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


//user account details will be a different table
var UserAcctSchema = new mongoose.Schema({
  username:{type:String,lowercase:true, unique:true, required: true},
  password:{type:String,unique:true,required:true},
  role:{type:String, enum:['client','manager','admin'],default:'client'},
  date_created:{type:Date, default:Date.now},
  visits:{type:Number, default:0},
  active:{type:Boolean, default:false},
  loggedin:{type:Boolean, default:false}
});

//save users's hash password
UserAcctSchema.pre('save',function(next){
  var userAcc = this;
  if(this.isModified('password') || this.isNew){
    bcrypt.genSalt(10,function(err,salt){
      if(err){
        return next(err);
      }
      bcrypt.hash(userAcc.password, salt, function(err,hash){
        if(err){
          return next(err);
        }
        userAcc.password = hash;
        next();
      })
    });
  }else{
    return next();
  }
});

//check a password
//load hash from database
//create an instance method on the schema
UserAcctSchema.methods.comparePassword = function(pswd, callback){
  bcrypt.compare(pswd, this.password, function(err, matched){
    if(err){
      return callback(err);
    }else{
      callback(null,matched);
    }
  });
  // TODO bcryptjs 2.4, supports promise. look into it
  // bcrypt.compare(pswd, this.password).then((res) => res===true)

}

module.exports = mongoose.model('UserAcct', UserAcctSchema);
