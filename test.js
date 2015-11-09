var spawn = require('child_process').spawn;
var p = spawn('node', [process.cwd() + '/server/lib/gameServer.js']);
process.on('uncaughtException', function (err) {
	console.log(err);
})
console.log(p);
