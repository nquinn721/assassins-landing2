var app = require('express')();
var spawn = require('child_process').spawn;
var p = spawn('node', [process.cwd() + '/test2.js']);
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
	res.send('<iframe src="http://ec2-54-165-181-175.compute-1.amazonaws.com:3001"></iframe>'+
		'<script src="/socket.io/socket.io.js"></script>'+
		'<script>' +
		'var socket = io.connect();' +
		'socket.on("hi", function(){ console.log("connected")});' +
		'</script>'
		);
});

io.on('connection', function (socket) {
	console.log('connected');
	socket.emit('hi');
});