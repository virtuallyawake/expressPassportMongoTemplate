var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {
    // List of authorized users
    var users = [
	{
	    id: 1,
	    username: 'john', 
	    password: '1234', 
	    email: 'john@doe.com' 
	},
	{ 
	    id: 2,
	    username: 'jane',
	    password: '5678',
	    email: 'jane@doe.com'
	}
    ];

    function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
	    fn(null, users[idx]);
	} else {
	    fn(new Error('User ' + id + ' does not exist'));
	}
    }

    function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
	    var user = users[i];
	    if (user.username === username) {
		return fn(null, user);
	    }
	}
	return fn(null, null);
    }

    // Passport session setup
    passport.serializeUser(function(user, done) {
	done(null, {id: user.id, username: user.username});
    });

    passport.deserializeUser(function(userData, done) {
	findById(userData.id, function (err, user) {
	    done(err, user);
	});
    });

    // Passport strategy setup
    passport.use(new LocalStrategy(
	function(username, password, done) {
	    process.nextTick(function () {

		// Find the user by username.  If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// indicate failure and set a flash message.  Otherwise, return the
		// authenticated `user`.
		findByUsername(username, function(err, user) {
		    if (err)
			return done(err);
 
		    if (!user) { 
			return done(null, false, { message: 'Unknown user ' + username });
		    }
		    if (user.password != password) {
			return done(null, false, { message: 'Invalid password' });
		    }
		    return done(null, user);
		});
	    });
	}
    ));
};
