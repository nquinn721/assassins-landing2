var express = require('express'),
	app = express(),
	jade = require('jade'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	server = app.listen(3000),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');


// DB Connection
mongoose.connect('mongodb://localhost/assassins');


app.use(express.static(__dirname + '/client/assets'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.set('views', __dirname + '/client');
app.use(function (req, res, next) {
	next();
});

var DB = require(process.cwd() + '/lib/db/connection.js');
var db = new DB(mongoose);
db.init();

// Instance
var instanceManager = require('./lib/instance/instanceManager');

// require('./server/lib/main')(requirejs, io);

app.get('/', function (req, res) {
	res.render('views/login');
});
app.get('/game', function (req, res) {
	db.isLoggedIn(req, function (yep) {
		if(yep){
			instanceManager.instance(req);
			res.render('index');
		}
		else res.redirect('/');
	});
});
app.get('/logout', function (req, res) {
	db.logout(req);
	res.redirect('/login');
});
app.get('/login', function (req, res) {
	res.render('views/login');
});
app.post('/login', function (req, res) {
	var obj = req.body;
	db.login(obj.username, obj.password, function(account){
		db.saveSession(req, account, function () {
			res.redirect('/game');
		});
	}, function () {
		res.redirect('/login');
	});
});


/**
 * Angular Routes
 */
app.get('/home', function (req, res) {
	res.render('views/home');
});
app.get('/account', function (req, res) {
	res.render('views/account');
});

app.get('/match-making', function (req, res) {
	res.render('views/matchmaking');
});
app.get('/game-stats', function (req, res) {
	res.render('views/gameStats');
});
app.get('/viewport', function (req, res) {
	res.render('views/viewport');
});
app.get('/character-select', function (req, res) {
	res.render('views/characterSelect');
});




	

		


