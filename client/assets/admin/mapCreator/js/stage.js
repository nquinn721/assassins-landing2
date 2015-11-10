MC.factory('stage', ['$http', '$rootScope', 'Item', 'visualMode', function ($http, $rootScope, Item, visualMode) {
	return {
		stage : new createjs.Stage(document.getElementById('map')),
		queue : new createjs.LoadQueue(true),
		map : 'map1',
		layout : 'layout1',
		itemId : 'floor',
		itemWidth : 50,
		itemHeight : 50,
		gridSize : 50,
		grid : [],
		items : [],
		waitingItems : [],
		mode : 'draw',
		selected : [],
		zoomLevel : 1,
		zoomChangeBy : 25,
		canvasWidth : 2000,
		canvasHeight : 1600,
		lines : [],
		keys : {
			8 : 'deleteItem',
			70 : 'f',
			86 : 'toggleVisualMode',
			27 : 'deselect'
		},
		init : function () {
			var self = this;
			this.queue.loadManifest("/game/map/maps/map1/loadManifest.json");
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener('tick', this.tick.bind(this));
			this.stage.on("stagemousedown", this.chooseMouseDown.bind(this));
			this.stage.on("stagemousemove", this.chooseMouseMove.bind(this));
			this.stage.on("stagemouseup", this.chooseMouseUp.bind(this));
			this.queue.on("complete", this.begin, this);
			this.setupKeys();
			$rootScope.zoomLevel = this.zoomLevel;

			this.visualModeClass = visualMode;
			this.visualModeClass.init(this);
		},
		redrawItems : function () {
			var items = [].concat(this.items);
			this.items = [];
			this.stage.removeAllChildren();
			for(var i = 0; i < items.length; i++)
				this.createItem({
					x : items[i].column * this.gridSize, 
					y : items[i].row * this.gridSize, 
					w : (this.gridSize === 25 ? items[i].w / 2 : items[i].w * 2), 
					h : (this.gridSize === 25 ? items[i].h / 2 : items[i].h * 2), 
					id : items[i].id
				});
			this.addWaitingItems();
		},
		zoomOut : function () {
			if(this.zoomLevel <= 0)return;
			this.itemWidth -= this.zoomChangeBy;
			this.itemHeight -= this.zoomChangeBy;
			this.gridSize -= this.zoomChangeBy;
			this.stage.canvas.width -= this.stage.canvas.width / 2;
			this.stage.canvas.height -= this.stage.canvas.height / 2;
			this.redrawItems();
			this.setupLines();


			this.zoomLevel--;
			$rootScope.zoomLevel = this.zoomLevel;
		},
		zoomIn : function () {
			if(this.zoomLevel >= 1)return;
			this.itemWidth += this.zoomChangeBy;
			this.itemHeight += this.zoomChangeBy;
			this.gridSize += this.zoomChangeBy;
			this.stage.canvas.width = this.canvasWidth;
			this.stage.canvas.height = this.canvasHeight;
			this.redrawItems();
			this.setupLines();

			this.zoomLevel++;
			$rootScope.zoomLevel = this.zoomLevel;
		},
		canZoomIn : function () {
			if(this.zoomLevel === 1)return true;	
		},
		canZoomOut : function () {
			if(this.zoomLevel === 0)return true;	
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
		clearLines : function () {
			for(var i = 0; i < this.lines.length; i++)this.stage.removeChild(this.lines[i]);	
		},
		line : function (x, y, w, h) {
			var g = new createjs.Shape();
			this.stage.addChild(g);
			g.graphics.beginFill("rgba(255,255,255,0.4)").drawRect(x, y, w, h);
			this.lines.push(g);
		},
		
		setItem : function (id, src) {
			this.itemId = id;
			$rootScope.currentItem = src;
		},
		setWidth : function (w) {
			this.itemWidth = w;
		},
		setHeight : function (h) {
			this.itemHeight = h;
		},
		createItem : function (obj, setItems) {
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
					id : obj.id || this.itemId
				},
				img = new createjs.Bitmap(this.queue.getResult(obj.id)),
				item = new Item(this, img, obj);
			item.init();
			this.stage.addChild(item.img);

			this.items.push(item);
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
		
		save : function (noApply) {
			if(!this.currentFile)return;
			$http({method : 'post', url : '/mapcreator-save-map', data : {mapJson : JSON.stringify(this.getItems()), map : this.map, layout : this.layout}});
			$rootScope.saved = 'Saved!';
			if(!noApply)
				$rootScope.$apply();
			setTimeout(function () {
				$rootScope.saved = '';
				$rootScope.$apply();
			}, 1000);

		},
		getItems : function () {
			return this.items.map(function (v) {
				return {
					x : v.x,
					y : v.y,
					id : v.id,
					w : v.w,
					h : v.h,
					row : v.row,
					column : v.column
				}
			});
		},
		canLayItem : function () {
			if(this.findItemWithinArea(this.items))
				return false;
			return true;
		},
		findItemWithinArea : function (arr) {
			if(!this.currentMousePos)return;

			var row = this.currentMousePos.row,
				column = this.currentMousePos.column,
				found;

			for(var i = 0; i < arr.length; i++){
				var item = arr[i];
					irow = item.row,
					icolumn = item.column,
					irows =  irow + Math.floor(item.h / this.gridSize),
					icolumns = icolumn + Math.floor(item.w / this.gridSize);

					for(var j = irow; j < irows; j++)
						for(var k = icolumn; k < icolumns; k++)
							if(j === row && k === column)found = true;
			}
			return found;
		},
		chooseMouseDown : function (e) {
			if(this.zoomLevel === 0)return;
			if(this.visualMode)this.visualModeClass.stageMouseDown(e);
			else this.stageMouseDown(e);	
		},
		chooseMouseMove : function (e) {
			if(this.zoomLevel === 0)return;
			if(this.visualMode)this.visualModeClass.stageMouseMove(e);
			else this.stageMouseMove(e);	
		},
		chooseMouseUp : function (e) {
			if(this.zoomLevel === 0)return;
			if(this.visualMode)this.visualModeClass.stageMouseUp(e);
			else this.stageMouseUp(e);	
		},
		stageMouseDown : function(e) {
			this.mouseDown = true;

			if(this.selected.length) {
				if(this.canLayItem())this.deselect();
				return;
			}


			this.createItem({
				x : e.stageX, 
				y : e.stageY
			});
		},
		toggleVisualMode : function () {
			$rootScope.visualMode = !$rootScope.visualMode;
			this.visualMode = !this.visualMode;
			this.visualModeClass.resetVisualBox();	
		},
		stageMouseMove : function (e) {
			var obj = {
		   		row : Math.floor(e.stageY / this.gridSize), 
		   		column : Math.floor(e.stageX / this.gridSize),
		   		x : Math.floor(e.stageX / this.gridSize) * this.gridSize, 
		   		y : Math.floor(e.stageY / this.gridSize) * this.gridSize,
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
			if(this.mouseDown && !this.selected.length){
				this.createItem({x : this.currentMousePos.x, y : this.currentMousePos.y});
				this.isDirty = true;
			}

			if(this.movingItems)this.moveItems();

		},
		moveItems : function () {
			for(var i = 0; i < this.selected.length; i++)this.selected[i].move(this.currentMousePos);	
		},
		stageMouseUp : function(e) {
			this.mouseDown = false;
			
			if(this.isDirty)
				this.save();
		},
		
		loadMap : function (map, layout) {
			var self = this;
			this.map = map;
			this.layout = layout;
			this.waitingItems = [];
			this.currentFile = 'game/map/maps/' + this.map + '/layouts/' + this.layout;
			this.stage.removeAllChildren();
			this.items = [];

			$rootScope.currentMap = map;
			$rootScope.currentLayout = layout;
			
			if(this.zoomLevel === 0)this.zoomIn();
			else this.setupLines();

			require([this.currentFile], function (items) {
				if(items)
					for(var i = 0; i < items.length; i++){
						var item = items[i];
						self.createItem(item, true);
					}
			});
		},
		deleteItem : function () {
			for(var i = 0; i < this.selected.length; i++){
				var item = this.selected[i];
				item.delete();
				this.removeItem(item);
			}
			this.selected = [];
			this.save();
		},
		deselect : function  () {
			for(var i = 0; i < this.selected.length; i++) this.selected[i].deselect();
			this.selected = [];
			$rootScope.visualMode = false;
			this.visualMode = false;
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
			return Math.floor(y / this.gridSize);
		},
		getColumn : function (x) {
			return Math.floor(x / this.gridSize);	
		},
		setupKeys : function () {
			var self = this;
			$(document).on('keydown', function (e) {
				if(self.keys[e.keyCode] && self.zoomLevel > 0){
					self[self.keys[e.keyCode]]();
					return false;
				}
			}).on('mousemove', function (e) {
				$('.currentItem').css({
					left : e.pageX + 20,
					top : e.pageY + 30
				}).show();
			});
		},
		removeChild : function (child) {
			this.stage.removeChild(child);
		},
		removeItem : function (item) {
			this.items.splice(this.items.indexOf(item), 1);	
			item.delete();
		},
		addChild : function (child) {
			this.stage.addChild(child);
		}
	}
}]);