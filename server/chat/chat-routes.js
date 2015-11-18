module.exports = function (app, db, io) {
	app.get('/start-chat/:from/:to', function (req, res) {
		var from = req.params.from,
			to = req.params.to,
			msg = req.params.msg,
			time = req.params.time;

		db.getSessionAndAccountByUserId(to, function (acc, session) {
			var room = '/chat-' + from + '-' + to;
			console.log(session);
			if(session)
				if(session.socketId)
					io.sockets.connected[session.socketId].emit('startChat', room);
				res.send({
					id : acc._id,
					room : room,
					user : acc.username,
					status : acc.status
				})
		});

	});
	app.post('/send-message', function (req, res) {
		var user = req.body.user,
			room = req.body.room,
			msg = req.body.msg,
			time = req.body.time;

		db.getSessionAndAccountByUserId(user, function (acc, session) {
			var obj = {
				id : req.session.accountId,
				msg : msg,
				time : time,
				user : req.session.account.username,
				status : 'active',
				room : room
			};
			if(session){
				io.sockets.connected[session.socketId].emit('message', obj);
				io.sockets.connected[session.socketId].emit('message-' + room, obj);
			}else{
				acc.messagesWaiting.push(obj);
				acc.save();
			}
		});
	});
	app.get('/user-status/:user', function (req, res) {
		Account.findOne({'_id' : req.params.user}, function (err, acc) {
			res.send(acc.status);
		});
	});
	app.get('/messages-waiting', function (req, res) {
		var user = req.session.accountId;
		db.getAccountByUserId(user, function (acc) {
			if(acc.messagesWaiting.length > 0){
				var userIds = [],
					status = {},
					statuses = 0;

				acc.messagesWaiting.forEach(function (v) {
					if(userIds.indexOf(v.id) < 0)userIds.push(v.id);
				});
				for(var i = 0; i < userIds.length; i++){
					(function (id) {
						db.getAccountByUserId(id, function (acc) {
							status[id] = acc.status;
							statuses++;
							if(statuses === userIds.length)send();
						});
					}(userIds[i]))
				}
				function send(){
					var obj = {};
					acc.messagesWaiting.map(function (v) {
						v.status = status[v.id];
						if(!obj[v.id])obj[v.id] = [];

						obj[v.id].push(v);
					});
					acc.messagesWaiting = [];
					acc.save();
					res.send(obj);
				}
			}

		})
	});
}