
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
	res.send("Signup!");
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
	res.redirect('/login')
    }
};
