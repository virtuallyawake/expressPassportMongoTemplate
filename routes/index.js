var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var hash = require('../helpers/hash');

module.exports = function(app, passport) {

    // Routes: access control
    app.get('/login', function(req, res) {
	res.render('login', { user: req.user, message: req.flash('error') });
    });
    app.post('/login',
	     passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}),
	     function(req, res) {
	         res.redirect('/');
	     });
    app.get('/signup', function(req, res) {
	res.render('signup', { message: req.flash('error') });
    });
    app.post('/signup', function(req, res) {
	var username = req.body.username.trim();
	var password = req.body.password.trim();

	if (!(username && password))
	    return req.flash("error", "User or password missing.");

	User.findById(username, function(err, user) {
	    if (err)
		return next(err);

	    if (user) {
		req.flash("error", "User already exists. Try another one.");
		return res.redirect('/signup');
	    }

	    crypto.randomBytes(16, function(err, bytes) {
		if (err) 
		    return next(err);

		var user = { _id: username };
		user.salt = bytes.toString('utf8');
		user.hash = hash(password, user.salt);

		User.create(user, function(err, newUser) {
		    if (err) {
			if (err instanceof mongoose.Error.ValidationError) {
			    req.flash("error", "User already exists. Try another one.");
			    return res.redirect('/signup');
			}
			return next(err);
		    }

		    // Account created successfully
		    console.log("Account created successfully.");
		    return res.render('accountCreated', {username: user._id});
		});
	    });
	});
    });
    app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
    });

    // Routes: application
    app.get('/', ensureAuthenticated, function(req, res){
	res.render('main', { user: req.user });
    });

    // Simple route middleware to ensure user is authenticated.
    function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
    }
};
