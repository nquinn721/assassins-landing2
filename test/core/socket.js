'use strict';
var requirejs = require(process.cwd() + "/test/requirejsSettings.js");
var expect = require('chai').should();
var io = require('socket.io-client');
var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

// it('Should broadcast to all users', function(done){
//   var client1 = io.connect(socketURL, options);

//   client1.on('connect', function(data){
//     client1.emit('connection name', chatUser1);

//     /* Since first client is connected, we connect
//     the second client. */
//     var client2 = io.connect(socketURL, options);

//     client2.on('connect', function(data){
//       client2.emit('connection name', chatUser2);
//     });

//     client2.on('new user', function(usersName){
//       usersName.should.equal(chatUser2.name + " has joined.");
//       client2.disconnect();
//     });

//   });

//   var numUsers = 0;
//   client1.on('new user', function(usersName){
//     numUsers += 1;

//     if(numUsers === 2){
//       usersName.should.equal(chatUser2.name + " has joined.");
//       client1.disconnect();
//       done();
//     }
//   });
// });
var app = require('express')();
global.server = app.listen(3000);
var client = io.connect(socketURL, options);
describe('Socket require layer', function() {
    // Load modules with requirejs before tests
    var mod;
    before(function(done) {
        requirejs(['socket'], function(module) {
            mod = module;
            done(); // We can launch the tests!
        });
    });


    describe('Testing emit and on', function(){
        it('should emit a new user to on event', function () {
            client.on('connect', function () {
                console.log('iowef');
            })
            // mod.on('new user', function (data) {
            //     expect(data).to.equal({id : 10, username : 'nate'});
            // });
            // mod.emit('new user', {id : 10, username : 'nate'});
        });
    });

});
