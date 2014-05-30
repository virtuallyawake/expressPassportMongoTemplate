var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var hash = require('../helpers/hash');

module.exports = function(passport) {

    // Passport session setup
    passport.serializeUser(function(user, done) {
	done(null, {username: user._id});
    });

    passport.deserializeUser(function(userData, done) {
	User.findOne(userData.username, function (err, user) {
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
		User.findOne({_id: username}, function(err, user) {
		    if (err)
			return done(err);
 
		    if (!user) { 
			return done(null, false, { message: 'Unknown user ' + username });
		    }
		    if (user.hash !== hash(password, user.salt)) {
			return done(null, false, { message: 'Invalid password' });
		    }
		    return done(null, user);
		});
	    });
	}
    ));
};
