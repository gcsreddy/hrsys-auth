
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./server/routes');//routes defined in routes.js file
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({'extended':true}));
app.use(bodyParser.json());


app.set('port',process.env.PORT || 3300);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.get("/",function(req,res){
//   res.send("Hello word!");
// });
var User = require('./models/user');


mongoose.connect('mongodb://localhost/hrsysdb');
//mongoose.connect('mongodb://imguruuser:imgurupassword@ds143340.mlab.com:43340/heroku_z1zz9ksq');
mongoose.connection.on('open',function(){
  console.log('mongoose connected');
});

require('./server/passport')(passport);
routes(app);//moving the routes to routes folder.

app.listen(app.get('port'), () => console.log("Server up on port 3300"));
