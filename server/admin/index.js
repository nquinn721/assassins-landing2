module.exports = function (app) {
	function isAdmin(req, res, next) {
	    if (req.session.account.admin)
	        return next();
	    res.redirect('/');
	}
	app.get('/admin', isAdmin, function (req, res) {
		res.render('views/admin/users/index', {page : 'admin'});
	});
}