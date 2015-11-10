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

	app.post('/search-users', function (req, res) {
		if(req.body.username === ''){
			res.send('');
		}else{
			var regexp = new RegExp("^"+ req.body.username);

			Session.find({"account.username" : regexp}, function (err, session) {
				Account.find({ username: regexp}, function (err, accounts) {
					var acc = accounts.map(function(v){
						var online = _.filter(session, function(obj) {
						    return _.where(obj, {username : v.username});
						});

						return {
							username : v.username, 
							id : v._id, 
							online : online.length ? true : false
						};
					});
					res.send(acc);
				});
			});
		}
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