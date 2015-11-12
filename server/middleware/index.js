module.exports = function (app, db, io) {
	var uuid = require('node-uuid'),
		OPEN_ROUTES = ['/login'];
	

	// Auth middleware
	app.use(function (req, res, next) {
		if(OPEN_ROUTES.indexOf(req.originalUrl) < 0){
			db.getSessionAndAccount(req, function (session, account) {
				if(session) {
					req.session = session;
					app.locals.session = session;
					app.locals.account = account;

					// Setup admin socket namespace
					if(session.account.admin && !global.ADMIN_SOCKET){
						global.ADMIN_SOCKET = io.of('/admin');
						ADMIN_SOCKET.on('connection', function(socket){
						  global.ADMIN_SOCKETE = socket;
						});
						ADMIN_SOCKET.emit('hi')
					}
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