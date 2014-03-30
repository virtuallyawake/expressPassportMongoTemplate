var express = require('express');
var connect = require('express/node_modules/connect');
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var util = require('util');

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes: access control
app.get('/login', function(req, res) {
    res.render('login', { user: req.user, message: req.flash('error') });
});
app.post('/login',
	  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}),
	  function(req, res) {
	           res.redirect('/');
	       });
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Routes: application
app.get('/', ensureAuthenticated, routes.main);

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var server = http.createServer(app);
server.timeout = 10*60*1000; // 10 minutes;

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
