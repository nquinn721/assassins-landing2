var express = require('express'),
	app = express(),
	jade = require('jade'),
	server = app.listen(3000, function(){ 
		console.log('\n**************************');
		console.log('Server started on port 3000')
		console.log('**************************\n');
	}),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');


process.on('uncaughtException', function (a,b,c) {
	console.log('Error: ' + a);
});

// Set global environment
if(process.env.HOME.match(/\/Users\/nate/))
	global.ENV = 'dev';
else global.ENV = 'prod';

// DB Connection
if(ENV === 'dev')
	mongoose.connect('mongodb://localhost/assassins');
else
	mongoose.connect('mongodb://nate:nate12345@ds051534.mongolab.com:51534/assassins');

console.log('\n**************************');
console.log('Environment set to ' + ENV);
console.log('**************************\n');

app.use(express.static(__dirname + '/client/assets'));
app.use(express.static(process.cwd() + '/main'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'jade');
app.set('views', __dirname + '/client');


// Database
var DB = require(process.cwd() + '/lib/db/connection.js');
var db = new DB(mongoose);
db.init();
// Instance
var instanceManager = require('./lib/instance/instanceManager');
instanceManager.init(db, io);



io.on('connection', function (socket) {
	socket.on('join', function (port) {
		socket.join(port);
	});
});



/**
 * Middleware
 */
require('./server/middleware/index')(app, db, io);


/**
 * Site Routes
 */
require('./server/site/routes')(app, db, instanceManager);
/**
 * Admin Routes
 */
require('./server/admin/index')(app);
require('./server/admin/map-creator-routes')(app);
require('./server/admin/user-routes')(app);


// Final redirect
app.use(function (req, res) {
	res.redirect('/');
});
