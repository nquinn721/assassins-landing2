define("core/ping", ['core/emitter', 'core/lib/underscore'], function (emitter, _) {
	function Ping () {
		this.pings = [];
		this.currentPing;
		this.average;
		this.realAverage;
		this.totalPings = 0;

		this.frames = 0;
	}

	Ping.prototype = {
		initServer : function () {
			emitter.on('serverTick', this.tick.bind(this));
			emitter.on('ping', this.setCurrentPing.bind(this));
		},
		initClient : function () {
			emitter.on('clientPing', this.sendPingBackToServer.bind(this));
		},
		setCurrentPing : function (ping) {
			this.currentPing = {
				timeDown : ping.endDown - ping.startDown,
				timeUp : Date.now() - ping.endDown,
				totalTime : Date.now() - ping.startDown
			}

			if(!this.average)this.average = this.currentPing.totalTime;
			else this.average = (this.average * this.totalPings + this.currentPing.totalTime) / (this.totalPings + 1);

			this.totalPings++;
		},
		pingClient : function (io) {
			io.emit('ping', {startDown : Date.now()});
		},
		sendPingBackToServer : function (obj) {
			var socket = obj.socket,
				packet = obj.ping;
			packet.endDown = Date.now();
			socket.emit('ping', packet);
		},
		tick : function (io) {
			this.frames++;

			if(this.frames % 100 === 0)
				this.pingClient(io);
		}
	}

	return new Ping;
});