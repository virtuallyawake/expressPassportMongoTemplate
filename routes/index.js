exports.main = function(req, res){
  res.render('main', { user: req.user });
};
