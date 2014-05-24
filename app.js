var express = require('express');
var connect = require('express/node_modules/connect');
var passport = require('passport');
var flash = require('connect-flash');
var models = require('./models');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var util = require('util');
var mongoose = require('mongoose');

// Configure passport
require('./auth/passport')(passport);

var app = express();
var cookieSecret = "session cookie secret";  // used to sign the session cookie
var cookieParser = express.cookieParser(cookieSecret);
var sessionKey = "express.sid"; // name of the session cookie
var sessionStore = new connect.middleware.session.MemoryStore();

// Configure express
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.engine('ejs', require('ejs-locals'));
// Moved express.static up to avoid interference with passport deserialize:
// https://github.com/jaredhanson/passport/issues/14#issuecomment-4863459
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({ store: sessionStore, key: sessionKey }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

routes(app, passport);

mongoose.set("debug", true);
mongoose.connect("mongodb://localhost/crm", function(err) {
    if (err)
	throw err;

    var server = http.createServer(app);
    server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
    });
});
