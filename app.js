var express = require('express'),
	app = express(),
	jade = require('jade'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	server = app.listen(3000),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	http = require('http');


// DB Connection
mongoose.connect('mongodb://localhost/assassins');

var OPEN_ROUTES = ['/login'];

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(process.cwd() + '/main'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'jade');
app.set('views', __dirname + '/client');

// Auth middleware
app.use(function (req, res, next) {
	if(OPEN_ROUTES.indexOf(req.originalUrl) < 0){
		db.getSession(req, function (session) {
			if(session) {
				req.session = session;
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

var DB = require(process.cwd() + '/lib/db/connection.js');
var db = new DB(mongoose);
db.init();

// Instance
var instanceManager = require('./lib/instance/instanceManager');
instanceManager.init(db);


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

/**
 * Angular Routes
 */
app.get('/an-start-game', function (req, res) {
	

	if(!req.session.instance){
		connect(req, res);
	} else {
		var request = http.request({host: 'localhost', port : 3001 }, function () {
			db.setInstanceAndTeam(req, req.session.instance, req.session.team, function () {
				res.render('views/site/game-frame', {url : 'http://localhost:' + req.session.instance});
			});
		});
		request.on('error', function (err) {
			connect(req, res);
		});
		request.end();
	}
});
function connect (req, res) {
	instanceManager.instance(req, function (port) {
		res.render('views/site/game-frame', {url : 'http://localhost:' + port});
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
app.use(function (req, res) {
	res.redirect('/');
	// db.getSession(req, function (yep) {
		// if(yep) res.redirect('/');
		// else res.redirect('/login');
	// });
})
