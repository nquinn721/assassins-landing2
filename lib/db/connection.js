var fs = require('fs');
function DB (db) {
	this.db = db;
	this.connection = db.connection;
	this.eventListeners = {};
}

DB.prototype = {
	init : function () {
		this.connection.on('error', this.dbFailed.bind(this));
		this.connection.once('open', this.connected.bind(this));
		this.setupModels();
		// this.createAccount();
	},
	dbFailed : function (err) {
		console.log('\n**************************');
	 	console.error('connection error: ' + err);
		console.log('**************************\n');
	},
	connected : function (a) {
		console.log('\n****************************************');
		console.log('DB connected to Host:' + this.connection.host + ' Port:' + this.connection.port);
		console.log('******************************************\n');
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
			.populate('characters')
			.populate('friends')
			.exec(function (err, acc) {
	        	if (err) throw new Error(err);
				if(acc)
					acc.verifyPassword(password, function(err, isMatch) {
						if(!isMatch)failcb();
						else{
							acc.status = 'active';
							self.emit('setAccountActive', acc);
							acc.save(function (e,a) {
								self.emit('login', a);
								cb(acc);
							});
						}
			        });
				else failcb(); 
			});
	},
	logout : function (req, cb) {
		var self = this;
		this.setOffline(req);
		Session.findOne({cookie : this.cookie(req)}, function (err, session) {
			if(global.ADMIN_SOCKET)ADMIN_SOCKET.emit('destroySession', session);
			self.emit('login', session);
			session.remove();
		});
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
			admin : true,
			status : true
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
				accountId : account._id,
				ip : req.connection.remoteAddress
			});
		this.emit('new-session', session);
		if(global.ADMIN_SOCKET) ADMIN_SOCKET.emit('newSession', session);
		
		session.save(cb);
	},
	getTeam : function (cookie, instance, team, cb) {
		Session.find({cookie : {$ne : this.cookie(cookie)}, team : team, instance : instance}, function (err, accounts) {
			if(err)throw new Error("No teams");
			else cb(accounts);
		});
	},
	getSessionAndAccount : function (req, cb) {
		this.getSession(req, function (session) {
			if(session)
				Account.findOne({_id : session.account._id}).populate('characters').populate('friends').exec(function (err, account) {
					session.account = account;
					cb(session, account);
				});
			else cb(false);
		});
	},
	getSession : function (req, cb) {
		Session.findOne({cookie : this.cookie(req)}, function (err, session) {
			if(err || !session)cb(false);
			else cb(session);
		});
	},
	getSessionAndAccountByUserId : function (user, cb) {
		var self = this;
		this.getAccountByUserId(user, function (acc) {
			self.getSessionByUserId(user, function (session) {
				cb(acc, session);
			});
		});
	},
	getAccountByUserId : function (user, cb) {
		Account.findOne({'_id': user}, function (err, acc) {
			cb(acc);
		});
	},
	getSessionByUserId : function (user, cb) {
		Session.findOne({'accountId' : user}, function (err, session) {
			cb(session);
		});
	},
	getSessionByUsername : function (username, cb) {
		Session.findOne({'account.username' : username}, function (err, session) {
			cb(session);
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
	setIdle : function (req, cb) {
		Account.update({'_id' : req.session.account._id}, {$set : {status : 'idle'}}, {}, cb || function(){});
		this.emit('setAccountIdle', req.session.account);
	},
	setActive : function (req, cb) {
		Account.update({'_id' : req.session.account._id}, {$set : {status : 'active'}}, {}, cb || function(){});
		this.emit('setAccountActive', req.session.account);
	},
	setOffline : function (req, cb) {
		Account.update({'_id' : req.session.account._id}, {$set : {status : 'offline'}}, {}, cb || function(){});
		this.emit('setAccountOffline', req.session);	
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
	addSocketIdToSession : function (cookie, socketId) {
		Session.update({cookie : cookie}, { $set : {socketId : socketId}}, {}, function(a,b){});
	},
	addFriend : function (req, friend, cb) {
		Account.findOne({'_id' : req.session.account._id}, function (err, acc) {
			if(acc.friends.indexOf(friend) < 0)acc.friends.push(friend);
			acc.save();
		});
		Account.findOne({'_id' : friend}, cb || function(){});
	},
	removeFriend : function (req, friend, cb) {
		Account.update({'_id' : req.session.account._id}, {$pull: { friends : friend }},{upsert:true}, cb || function(){});
	},
	cookie : function (obj) {
		var cookie;
		if(typeof obj === 'object')
			cookie = obj.cookies.al;
		else cookie = obj;
		return cookie;
	},
	on : function (event, cb) {
		if(!this.eventListeners[event])this.eventListeners[event] = [];
		this.eventListeners[event].push(cb);
	},
	emit : function (event, data) {
		if(this.eventListeners[event])
			for(var i = 0; i < this.eventListeners[event].length; i++)
				this.eventListeners[event][i](data);
	}
}


module.exports = DB;
