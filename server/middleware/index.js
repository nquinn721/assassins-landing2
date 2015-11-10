module.exports = function (app, db) {
	var uuid = require('node-uuid'),
		OPEN_ROUTES = ['/login'];
	

	// Auth middleware
	app.use(function (req, res, next) {
		if(OPEN_ROUTES.indexOf(req.originalUrl) < 0){
			db.getSession(req, function (session) {
				if(session) {
					req.session = session;
					app.locals.session = session;
					next();
				}
				else res.redirect('/login');
			});
		} else next();
	});

	// Cookie middleware
	app.use(function (req, res, next) {
		if(!req.cookies.al) res.cookie('al', uuid.v1());
		next();
	});
}