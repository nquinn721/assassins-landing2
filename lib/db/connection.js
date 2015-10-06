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
		for(var i = 0; i < models.length; i++)
			var model = require('./models/' + models[i].split('.')[0]);

	},
	createAccount : function () {
		var account = new Account({
			username : 'nate',
			password : 'nate123',
			firstName : 'Nate',
			lastName : 'Quinn',
			email : 'natethepcspecialist@gmail.com',
			characters : ["assassin", "brute"]
		});

		account.save(function (err) {
			if(err)throw new Error(err);
		});
	},
	login : function (username, password, cb, failcb) {
		var self = this;

		Account.findOne({username : username})
			// .populate('characters')
			.exec(function (err, acc) {
	        	if (err) throw new Error(err);
				if(acc)
					acc.verifyPassword(password, function(err, isMatch) {
						if(!isMatch)failcb();
						else
							self.sendAccount(acc, cb, failcb);
			        });
				else failcb(); 
			});
	},
	logout : function (req, cb) {
		Session.findOne({ip : req.connection.remoteAddress}).remove().exec(cb);	
	},
	sendAccount : function (acc, cb) {
		var account = {
			username : true,
			firstName : true,
			lastName : true,
			gold : true,
			xp : true,
			email : true,
			_id : true,
			characters : true,
			gamesWon : true,
			gamesLost : true,
			totalGames : true
		}
    	for(var i in account)
    		account[i] = acc[i];
    	cb(account);
	},
	dbFailed : function () {
	 	console.error.bind(console, 'connection error:');
	},
	saveSession : function  (req, account, cb) {
		var ip = req.connection.remoteAddress,
			session = new Session({
				account : account,
				ip : ip
			});
		session.save(cb);
	},
	getSession : function (req, cb) {
		Session.findOne({ip : req.connection.remoteAddress}, function (err, session) {
			if(err)console.log(err);
			else cb(session);
		});
	},
	isLoggedIn : function (req, cb) {
		var ip = req.connection.remoteAddress;
		Session.findOne({ip : ip}, function (err, session) {
			if(session)cb(true);
			else cb(false);
		});
	},
	destroySession : function (req, cb) {
		Session.find({ip : req.connection.remoteAddress}).remove().exec(cb);
	}
}


module.exports = DB;
