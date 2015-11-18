module.exports = function(app, db, instanceManager){
	var http = require('http'),
		_ = require('underscore'),
		host = ENV === 'dev' ? 'http://localhost' : 'http://ec2-54-165-181-175.compute-1.amazonaws.com';
	
	app.get('/', function (req, res) {
		res.render('views/site/index');
	});
	app.get('/logout', function (req, res) {
		res.clearCookie('al');
		db.logout(req);
		res.redirect('/login');
	});
	app.get('/login', function (req, res) {
		res.render('views/site/login');
	});
	app.post('/login', function (req, res) {
		var obj = req.body;
		db.login(obj.username, obj.password, function(account){
			db.saveSession(req, account, function () {
				res.redirect('/');
			});
		}, function () {
			res.redirect('/login');
		});
	});

	app.get('/get-session', function (req, res) {
		res.send(req.session);
	});
	app.get('/ping', function (req, res) {
		res.end();
	});

	

	app.get('/game-stats', function (req, res) {
		db.getSession(req, function (session) {
			res.send(session.gameStats);
		});
	});

	/**
	 * Angular Routes
	 */	
	app.get('/an-start-game', function (req, res) {
		if(!req.session.instance || req.session.instance === 'false'){
			connect(req, res);
		} else {
			http.get(host + ':' + req.session.instance, function () {
				res.render('views/site/game-frame', {url : host + ':' + req.session.instance});
				
			}).on('error', function () {
				db.clearInstance(req, function () {
					res.send('noinstance');
				});
			})
			
		}
	});
	function connect (req, res) {
		instanceManager.instance(req, function (port) {
			res.render('views/site/game-frame', {url : host + ':' + port});
		});
	}

	app.get('/an-home', function (req, res) {
		res.render('views/site/home');
	});
	app.get('/an-account', function (req, res) {
		res.render('views/site/account');
	});
	app.get('/an-game-stats', function (req, res) {
		res.render('views/site/gameStats');
	});
	app.get('/an-game', function (req, res) {
		res.render('views/site/game');
	});
	
}