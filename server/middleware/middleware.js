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
					// Set active if not already
					if(account.status !== 'active') db.setActive(req);

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

	// User Away middleware
	app.use(function (req, res, next) {
		if(!req.session) return next();
		
		clearTimeout(req.session.idle);
		req.session.idle = setTimeout(function () {
			clearTimeout(req.session.idle);
			db.setIdle(req);
		}, 1000 * 60 * 30);
		next();
	});
	app.use(function (req, res, next) {
		req.flash = function(type, msg){
			console.log(type, msg);
			if(!req.flashObj)req.flashObj = {};
			req.flashObj[type] = msg;
			console.log(req.flashObj);
		}
		if(req.flashObj){
			console.log(req.flashObj);
			res.locals.flash = req.flashObj;
		}
		next();
	})
	// app.use(function (req, res, next) {
	// 	if(req.session)req.session.save();
	// 	next();
	// });
}