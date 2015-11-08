var fs = require('fs');
function DB (db) {
	this.db = db;
	this.connection = db.connection;
}

DB.prototype = {
	init : function () {
		this.connection.on('error', this.dbFailed.bind(this));
		this.connection.once('open', this.connected.bind(this));
		this.setupModels();
		// this.createAccount();
	},
	dbFailed : function (err) {
	 	console.error('connection error: ' + err);
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
			admin : true,
			email : 'nate@gmail.com',
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
		Session.findOne({cookie : this.cookie(req)}).remove().exec(cb);	
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
			totalGames : true,
			admin : true
		}
    	for(var i in account)
    		account[i] = acc[i];
    	cb(account);
	},
	saveSession : function  (req, account, cb) {
		var cookie = this.cookie(req),
			session = new Session({
				account : account,
				cookie : cookie,
				ip : req.connection.remoteAddress
			});
		session.save(cb);
	},
	getTeam : function (cookie, instance, team, cb) {
		Session.find({cookie : {$ne : this.cookie(cookie)}, team : team, instance : instance}, function (err, accounts) {
			if(err)throw new Error("No teams");
			else cb(accounts);
		});
	},
	getSession : function (req, cb) {
		Session.findOne({cookie : this.cookie(req)}, function (err, session) {
			if(err || !session)cb(false);
			else cb(session);
		});
	},
	destroySession : function (req, cb) {
		Session.find({cookie : this.cookie(req)}).remove().exec(cb);
	},
	getInstance : function (instance, cb) {
		Session.find({instance : instance}, function (err, accounts) {
			if(err)throw new Error("Connection.js line 104; Failed to find user");
			else cb(accounts);
		});
	},
	
	setInstanceAndTeam : function (cookie, port, team, cb) {
		cookie = this.cookie(cookie);

		Session.findOne({cookie : cookie}, function (err, acc) {
			if(acc){
				acc.instance = port;
				acc.team = team
				acc.save(cb);
			}
		});
	},
	clearInstance : function (cookie, cb) {
		Session.findOne({cookie : this.cookie(cookie)}, function (err, acc) {
			if(acc){
				acc.instance = undefined;
				acc.team = undefined;
				acc.player = undefined;
				acc.started = undefined;
				acc.character = undefined;
				acc.account.character = undefined;

				acc.save(cb);
			}
		});
	},
	clearAllInstances : function (port) {
		Session.find({instance : port}, function (err, acc) {
			for(var i in acc){
				acc[i].instance = undefined;
				acc[i].save();
			}
		});	
	},
	setStarted : function (cookie, cb) {
		cookie = this.cookie(cookie);
		Session.findOne({cookie : cookie}, function (err, acc) {
			acc.started = true;
			acc.save(cb);
		});
	},
	setCharacter : function (cookie, character, cb) {
		Session.findOne({cookie : cookie}, function (err, acc) {
			if(acc){
				acc.character = character;
				acc.save(cb);
			}
		});
	},
	cookie : function (obj) {
		var cookie;
		if(typeof obj === 'object')
			cookie = obj.cookies.al;
		else cookie = obj;
		return cookie;
	}
}


module.exports = DB;
