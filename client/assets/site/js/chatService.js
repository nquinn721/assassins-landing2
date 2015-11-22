app.factory('chatService', ['$rootScope', 'session', '$compile', '$http', 'io', function ($rootScope, session, $compile, $http, socket) {
	var chatsOpen = [],
		closedChats = [],
		chatService = {
			checkOpen : function (to, from) {
				if( chatsOpen.indexOf('/chat-' + to + '-' + from) > -1 ||
					chatsOpen.indexOf('/chat-' + from + '-' + to) > -1 ||
					chatsOpen.length >= 5)return false;
				return true;
			},
			checkClosed : function (room) {
				var to = room.split('-')[1],
					from = room.split('-')[2];
				if( closedChats.indexOf('/chat-' + to + '-' + from) > -1 ||
					closedChats.indexOf('/chat-' + from + '-' + to) > -1){
					return false;
				}
				return true;
			},
			startChat : function (to, msg, time) {
				var from = session.get().account._id,
					self = this;

				if(!this.checkOpen(to, from))return;

				$http.get('/start-chat/' + from + '/' + to).then(function (chatSession) {
					var chatData = chatSession.data,
						room = chatData.room,
						username = chatData.user,
						status = chatData.status;
					self.createChat(to, room, username, status, false, false, false, chatData.isFriend);
				});
			},
			startReceivingChat : function (chatSession) {
				var to = chatSession.room.split('-')[1],
					from = chatSession.room.split('-')[2];

				if(!this.checkOpen(to, from))return;
				this.createChat(
					chatSession.id,
					chatSession.room, 
					chatSession.user,
					chatSession.status, 
					chatSession.time,
					(this.checkClosed(chatSession.room) ? chatSession.msg : null),
					true,
					chatSession.isFriend
				);
			},
			createChat : function (chatUserId, room, username, status, time, msg, receiving, isFriend) {
				chatsOpen.push(room);
				if(chatsOpen.length >= 5)return;
				var chat = $compile("<chat " +
					"room='" + room + "'" +
					"userid='" + chatUserId + "'" +
					"user='" + username + "'" +
					"total-chats='" + chatsOpen.length + "'" + 
					"status='" + status + "'" +
					(time ? "time='" + time + "'" : "") +
					(msg ? "msg='" + msg + "'" : "") +
					(receiving ? "receiving='true'" : "") +
					(isFriend ? "isFriend='" + isFriend + "'" : "") +
					"></chat>")($rootScope);

				$('.body').append(chat);

				$rootScope.$on('destroyed-chat-' + room, function () {
					chatsOpen.splice(chatsOpen.indexOf(room),1);
					closedChats.push(room);
					$('.chat-box').each(function () {
						if(parseInt($(this).css('right')) > 50)
							$(this).animate({right : '-=228px'});
					});
				});
			}
		
		};

	socket.on('message', function (chatSession) {
		chatService.startReceivingChat(chatSession);
	});

	$http.get('/messages-waiting').then(function (messages) {
		for(var i in messages.data){
			var info = messages.data[i][0],
				msgs = messages.data[i].map(function (v) {
				return {msg : v.msg, time : v.time};
			});
			chatService.createChat(info.id, info.room, info.user, info.status, info.time, JSON.stringify(msgs), true);
		}
	});
	return chatService;
}]);