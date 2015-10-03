var express = require('express'),
	app = express(),
	jade = require('jade'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	server = app.listen(process.env.PORT || 3000),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	mongoStore = require('connect-mongo')(session),
	bodyParser = require('body-parser');


// DB Connection
mongoose.connect('mongodb://localhost/assassins');
global.define = require('amdefine')(module);
global.socketAccounts = {};

requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/main/',
    paths : {
    	_ : 'underscore'
    }
});

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(__dirname + '/main'));
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.set('views', __dirname + '/client');
// app.use(session({
// 	secret: '1-0#=1$@!^alfj!F@#GA@G%QQGHY$^#',
// 	resave: false,
// 	saveUninitialized: true,
// 	store : new mongoStore({db : 'mongodb://localhost/assassins'}),
// 	cookie: { secure: true }
// }));
app.use(function (req, res, next) {
	next();
});

var DB = require('./lib/db/connection.js');
var db = new DB(mongoose);
db.init();

require('./server/lib/main')(requirejs, io);


app.get('/game', function (req, res) {
	res.render('game');
});

app.get('/', function (req, res) {
	res.render('index');
});
app.get('/account', function (req, res) {
	res.render('views/account');
});
app.get('/login', function (req, res) {
	res.render('views/login');
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
app.post('/login', function (req, res) {
	var obj = req.body;
	db.login(obj.username, obj.password, function(user){
		res.send(user);
	}, function () {
		res.send('failedLogin');
	});
})




	

		


