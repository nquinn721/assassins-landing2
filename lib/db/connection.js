var fs = require('fs');
function DB (db) {
	this.db = db;
	// this.connection = db.connection;
}

DB.prototype = {
	init : function () {
		// this.connection.on('error', this.dbFailed.bind(this));
		// this.connection.once('open', this.connected.bind(this));
		this.setupModels();
		// this.createAccount();
	},
	connected : function () {
		console.log('DB connected!');
	},
	setupModels : function () {
		var models = fs.readdirSync('./lib/db/models');

		// for(var i = 0; i < models.length; i++)
		// 	require('game/db/models/' + models[i]);
		require('./models/account');

	},
	createAccount : function () {
		var account = new Account({
			username : 'bob',
			password : 'bob123',
			firstName : 'Bob',
			lastName : 'Bobart',
			email : 'bobbydonuts@gmail.com'
		});

		account.save(function (err) {
			if(err)throw new Error(err);
		});
	},
	login : function (username, password, cb, failcb) {
		var self = this;
		Account.findOne({username : username}, function (err, acc) {
        	if (err) throw err;
			if(acc)
				acc.verifyPassword(password, function(err, isMatch) {
					if(!isMatch)failcb();
					else
						self.sendAccount(acc, cb, failcb);
		        });
		});
	},
	loginId : function (id, cb) {
		var self = this;
		Account.findOne({_id : id}, function (err, acc) {
			if(err)throw new Error;
			else self.sendAccount(acc, cb);
		})	
	},
	sendAccount : function (acc, cb) {
		var account = {
			username : true,
			firstName : true,
			lastName : true,
			gold : true,
			xp : true,
			email : true,
			_id : true
		}
    	for(var i in account)
    		account[i] = acc[i];
    	cb(account);
	},
	dbFailed : function () {
	 	console.error.bind(console, 'connection error:');
	}
}


module.exports = DB;
