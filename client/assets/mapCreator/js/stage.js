MC.factory('stage', ['$http', '$rootScope', 'Item', function ($http, $rootScope, Item) {
	return {
		stage : new createjs.Stage(document.getElementById('map')),
		queue : new createjs.LoadQueue(true),
		map : 'map1',
		layout : 'layout1',
		itemType : 'floor',
		itemWidth : 50,
		itemHeight : 50,
		gridSize : 50,
		grid : [],
		items : [],
		waitingItems : [],
		mode : 'draw',
		selected : [],
		keys : {
			8 : 'deleteItem',
			70 : 'f',
			86 : 'toggleVisualMode',
			27 : 'deselect'
		},
		init : function () {
			var self = this;
			this.queue.loadManifest("/maps/map1/loadManifest.json");
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener('tick', this.tick.bind(this));
			this.stage.on("stagemousedown", this.chooseMouseDown.bind(this));
			this.stage.on("stagemousemove", this.chooseMouseMove.bind(this));
			this.stage.on("stagemouseup", this.chooseMouseUp.bind(this));
			this.queue.on("complete", this.begin, this);
			this.setupKeys();
		},
		begin : function () {
			this.setupLines();
		},
		setupLines : function () {
			for(var x = this.stage.canvas.width - this.gridSize; x > 0; x -= this.gridSize)
				this.line(x, 0, 1, this.stage.canvas.height);
			for(var y = this.stage.canvas.height - this.gridSize; y > 0; y -= this.gridSize)
				this.line(0, y, this.stage.canvas.width, 1);
			
		},
		line : function (x, y, w, h) {
			var g = new createjs.Shape();
			this.stage.addChild(g);
			g.graphics.beginFill("rgba(255,255,255,0.4)").drawRect(x, y, w, h);
		},
		destroyVisualBox : function () {
			this.stage.removeChild(this.visualBox);
		},
		drawVisualBox : function (x, y, w, h) {
			this.visualBox = new createjs.Shape();
			this.stage.addChild(this.visualBox);
			this.visualBox.graphics.beginStroke('blue').beginFill("rgba(7, 48, 133, 0.43)").drawRect(x, y, w, h);		
		},
		setItem : function (type, src) {
			this.itemType = type;
			$rootScope.currentItem = src;
		},
		setWidth : function (w) {
			this.itemWidth = w;
		},
		setHeight : function (h) {
			this.itemHeight = h;
		},
		createItem : function (obj) {
			if(!this.canLayItem())return;
			var column = this.getColumn(obj.x),
				row = this.getRow(obj.y),
				obj = {
					x : column * this.gridSize, 
					y : row * this.gridSize,
					w : obj.w || this.itemWidth,
					h : obj.h || this.itemHeight,
					row : row,
					column : column,
					type : obj.type || this.itemType
				},
				img = new createjs.Bitmap(this.queue.getResult(obj.type)),
				item = new Item(this, img, obj);
			item.init();
			this.stage.addChild(item.img);
			this.waitingItems.push(item);

			return img;
		},
		addWaitingItems : function () {
			for (var i = this.waitingItems.length - 1; i >= 0; i--) {
				var item = this.waitingItems[i];
				if(this.items.indexOf(item) < 0)
					this.items.push(item);	
			};
			this.waitingItems = [];
			this.save();
		},
		
		save : function () {
			if(!this.currentFile)return;
			$http({method : 'post', url : '/save-map', data : {mapJson : JSON.stringify(this.getItems()), map : this.map, layout : this.layout}});
		},
		getItems : function () {
			return this.items.map(function (v) {
				return {
					x : v.x,
					y : v.y,
					type : v.type,
					w : v.w,
					h : v.h,
					row : v.row,
					column : v.column
				}
			});
		},
		canLayItem : function () {
			if(this.findItemWithinArea(this.items) || this.findItemWithinArea(this.waitingItems))
				return false;
			return true;
		},
		findItemWithinArea : function (arr) {
			if(!this.currentMousePos)return;

			var w = this.itemWidth,
				h = this.itemHeight,
				row = this.currentMousePos.row,
				column = this.currentMousePos.column,
				rows = w / this.gridSize,
				columns = h / this.gridSize,
				found;

			for(var i = 0; i < arr.length; i++){
				var item = arr[i];
					irow = item.row,
					icolumn = item.column,
					irows = item.w / this.gridSize,
					icolumns = item.h / this.gridSize;

				for(var y = 0; y < rows; y++)
					for(var x = 0; x < columns; x++)
						for(iy = 0; iy < irows; iy++)
							for(ix = 0; ix < icolumns; ix++)
								if(irow + iy === row + y && icolumn + ix === column + x)found = true;
			}
			return found;
		},
		checkForItem : function () {
			var found,
				mp = this.currentMousePos;

			for(var i = 0; i < this.items.length; i++){
				var item = this.items[i];
					row = item.row,
					column = item.column;
				if(mp.row === row && mp.column === column)found = item;
			}
			for(var i = 0; i < this.waitingItems.length; i++){
				var item = this.waitingItems[i],
					row = item.row,
					column = item.column;

				if(mp.row === row && mp.column === column)found = item;
			}
			if(found)return found;
		},
		chooseMouseDown : function (e) {
			if(this.visualMode)this.visualModeMouseDown(e);
			else this.stageMouseDown(e);	
		},
		chooseMouseMove : function (e) {
			if(this.visualMode)this.visualModeMouseMove(e);
			else this.stageMouseMove(e);	
		},
		chooseMouseUp : function (e) {
			if(this.visualMode)this.visualModeMouseUp(e);
			else this.stageMouseUp(e);	
		},
		visualModeMouseDown : function (e) {
			this.visualMouseCoords = {
				x : e.stageX,
				y : e.stageY
			}
			this.visualMouseDown = true;
		},
		visualModeMouseMove : function (e) {
			if(this.visualMouseDown){
				var w = e.stageX - this.visualMouseCoords.x,
					h = e.stageY - this.visualMouseCoords.y;

				this.destroyVisualBox();
				this.drawVisualBox(
					this.visualMouseCoords.x,
					this.visualMouseCoords.y,
					w,
					h
				);
			}
		},
		visualModeMouseUp : function (e) {
			var box = this.visualBox.graphics.command;
			this.visualMouseDown = false;

			this.selected = [];

			for(var i = 0; i < this.items.length; i++){
				var item = this.items[i];
				item.deselect();
				if(item.x >= box.x && item.x <= box.x + box.w &&
					item.y >= box.y && item.y <= box.y + box.h ||
					item.x + item.w >= box.x && item.x + item.w <= box.x + box.w &&
					item.y + item.h >= box.y && item.y + item.h <= box.y + box.h)item.select();
			}
			this.destroyVisualBox();

		},
		stageMouseDown : function(e) {
			var item = this.checkForItem();
			this.mouseDown = true;

			if(this.selected.length) return;


			this.createItem({
				x : e.stageX, 
				y : e.stageY
			});
		},
		toggleVisualMode : function () {
			$rootScope.visualMode = !$rootScope.visualMode;
			this.visualMode = !this.visualMode;	
		},
		stageMouseMove : function (e) {
			var obj = {
		   		row : Math.floor(e.stageY / 50), 
		   		column : Math.floor(e.stageX / 50),
		   		x : Math.floor(e.stageX / 50) * 50, 
		   		y : Math.floor(e.stageY / 50) * 50,
		   	}, c = this.currentMousePos;

		   	if(c){
			   	if(obj.row > c.row || obj.row < c.row){
			   		obj.movedRow = (obj.row - c.row);
			   		obj.movedY = (obj.row - c.row) * this.gridSize;
			   	}
			   	if(obj.column < c.column || obj.column > c.column){
			   		obj.movedColumn = (obj.column - c.column);
			   		obj.movedX = (obj.column - c.column) * this.gridSize;
			   	}
		   	}
		   	this.currentMousePos = obj;
			if(this.mouseDown && !this.selected.length)
				this.createItem({x : this.currentMousePos.x, y : this.currentMousePos.y});

			if(this.movingItems)this.moveItems();

		},
		moveItems : function () {
			for(var i = 0; i < this.selected.length; i++)this.selected[i].move(this.currentMousePos);	
		},
		stageMouseUp : function(e) {
			this.mouseDown = false;
			this.addWaitingItems();
		},
		
		loadMap : function (map, layout) {
			var self = this;
			this.map = map;
			this.layout = layout;
			this.waitingItems = [];
			this.currentFile = 'maps/' + this.map + '/layouts/' + this.layout;
			this.stage.removeAllChildren();
			this.setupLines();

			require([this.currentFile], function (items) {
				self.items = items || [];
				if(items)
					for(var i = 0; i < items.length; i++){
						var item = items[i];
						self.createItem(item);
					}
			});
		},
		deleteItem : function () {
			for(var i = 0; i < this.selected.length; i++){
				var item = this.selected[i];
				item.delete();
				this.items.splice(this.items.indexOf(item), 1);
			}
			this.selected = [];
			this.save();
		},
		deselect : function  () {
			for(var i = 0; i < this.selected.length; i++) this.selected[i].deselect();
			this.selected = [];
		},
		tick : function () {
			this.stage.update();
			$rootScope.cantLay = !this.canLayItem();
		   	$rootScope.$apply();
		},
		getColRow : function (x, y) {
			if(typeof x === obj){
				x = obj.x;
				y = obj.y;
			}
			var row = this.getRow(y),
				column = this.getColumn(x);
			return {row : row, column : column};
		},
		getRow : function (y) {
			return Math.floor(y / 50);
		},
		getColumn : function (x) {
			return Math.floor(x / 50);	
		},
		setupKeys : function () {
			var self = this;
			$(document).on('keydown', function (e) {
				if(self.keys[e.keyCode]){
					self[self.keys[e.keyCode]]();
					return false;
				}
			}).on('mousemove', function (e) {
				$('.currentItem').css({
					left : e.pageX + 20,
					top : e.pageY + 30
				}).show();
			});
		}
	}
}]);