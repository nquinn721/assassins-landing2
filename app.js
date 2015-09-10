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
	mongoStore = require('connect-mongo')(session);


// DB Connection
mongoose.connect('mongodb://localhost/assassins');
global.db = mongoose;
global.define = require('amdefine')(module);
global.socketAccounts = {};

requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/',
    paths : {
    	_ : 'underscore'
    }
});

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/client/');
// app.use(session({
// 	secret: '1-0#=1$@!^alfj!F@#GA@G%QQGHY$^#',
// 	resave: false,
// 	saveUninitialized: true,
// 	store : new mongoStore({db : 'mongodb://localhost/assassins'}),
// 	cookie: { secure: true }
// }));
// app.use(function (req, res, next) {
// 	console.log(req.session);
// 	req.session.user = 1;
// 	next();
// });


require('./server/lib/main')(requirejs, io);

app.get('/game', function (req, res) {
	// res.cookie('asc', "55f0eca776ef93f3359c1af7");
	res.render('game');
});

app.get('/', function (req, res) {
	res.render('index');
});




	

		


