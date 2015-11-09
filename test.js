var spawn = require('child_process').spawn;
var p = spawn('node', [process.cwd() + '/server/lib/gameServer.js']);
console.log(p);
