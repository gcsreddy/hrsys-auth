
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
  res.header('Access-Control-Allow-Origin', '*');//TODO: remove *
  res.header('Access-Control-Allow-Headers',
  'Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');

  next();
});

app.use((req, res, next) => {
//http://stackoverflow.com/questions/41616757/angular-2-http-observable-request-not-returning-response-header
// List of headers that are to be exposed to the XHR front-end object
res.header('Access-Control-Expose-Headers', 'Authorization');
next();
});

// app.get("/",function(req,res){
//   res.send("Hello word!");
// });
var User = require('./models/user');


mongoose.connect('mongodb://localhost/hrsysdb');
mongoose.connection.on('open',function(){
  console.log('mongoose connected');
});

require('./server/passport')(passport);
routes(app);//moving the routes to routes folder.

app.listen(app.get('port'), () => console.log("Server up on port 3300"));
