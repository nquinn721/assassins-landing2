ADMIN.factory('visualMode', ['$rootScope', function ($rootScope) {
	$rootScope.changeItem = function (mode) {
		$rootScope.visualItem = mode;
		visualMode.changeMode(mode);
	};


	function VisualMode(){
		this.visualItem = 'selection';
	}
	VisualMode.prototype = {
		init : function (stage) {
			this.stage = stage;
		},
		changeMode : function (mode) {
			this.visualItem = mode;
			if(mode === 'combineTiles')this.combineSelected();
		},
		destroyVisualBox : function () {
			this.stage.removeChild(this.visualBox);
		},
		resetVisualBox : function () {
			this.visualMouseDown = false;
			this.visualMouseCoords = null;
			this.destroyVisualBox();
		},
		drawVisualBox : function (x, y, w, h, color) {
			this.visualBox = new createjs.Shape();
			this.stage.addChild(this.visualBox);
			this.visualBox.graphics.beginStroke('blue').beginFill(color || "rgba(7, 48, 133, 0.43)").drawRect(x, y, w, h);		
		},
		stageMouseDown : function (e) {
			this.selectMouseDown(e);
		},
		stageMouseMove : function (e) {
			this.selectMouseMove(e);
		},
		stageMouseUp : function (e) {
			this.selectMouseUp(e);
		},
		selectMouseDown : function (e) {
			this.visualMouseCoords = {
				x : e.stageX,
				y : e.stageY
			}
			this.visualMouseDown = true;
		},
		selectMouseMove : function (e) {
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
		selectMouseUp : function (e) {
			var box = this.visualBox.graphics.command,
				bx = box.x,
				bw = box.w,
				by = box.y,
				bh = box.h;

			if(bw < 0){
				bx = bx + bw;
				bw = Math.abs(bw);
			}

			if(bh < 0){
				by = by + bh;
				bh = Math.abs(bh);
			}


			this.visualMouseDown = false;

			if(this.visualItem === 'selection')this.selectItems(bx, by, bw, bh);
			else if(this.visualItem === 'tileFill')this.fillTiles(bx, by, bw, bh);
			
			this.destroyVisualBox();

		},
		fillTiles : function (x, y, w, h) {
			var column = Math.floor(x / 50),
				row = Math.floor(y / 50),
				columns = column + Math.floor(w / 50),
				rows = row + Math.floor(h / 50);

			for(var i = column; i <= columns; i++)
				for(var j = row; j <= rows; j++)
					this.stage.createItem({x : i * this.stage.gridSize, y : j * this.stage.gridSize}, true);
		},
		selectItems : function (bx, by, bw, bh) {
			this.stage.selected = [];
			for(var i = 0; i < this.stage.items.length; i++){
				var item = this.stage.items[i],
					x = item.x,
					y = item.y,
					w = item.w,
					h = item.h;


				item.deselect();


				for(var j = x; j < x + w; j++)
					for(var k = y; k < y + h; k++)
						if(j >= bx && j <= bx + bw && k >= by && k <= by + bh && !item.selected)item.select();
			}
		},
		combineTiles : function (x, y, w, h) {
			var newItem = {w : 0, h : 0, xs : [], ys : []};

			for(var l = 0; l < this.stage.selected.length; l++){
				var item = this.stage.selected[l];
				if(typeof newItem.type === 'undefined')newItem.type = item.type;
				if(typeof newItem.x !== 'number')newItem.x = item.x;
				if(typeof newItem.y !== 'number')newItem.y = item.y;
				console.log(newItem);
				if(newItem.xs.indexOf(item.x) < 0){
					newItem.w += item.w;
					newItem.xs.push(item.x);
				}
				if(newItem.ys.indexOf(item.y) < 0){
					newItem.h += item.h;
					newItem.ys.push(item.y);
				}
				this.stage.removeItem(item);
			}

			this.stage.createItem(newItem, true);
			this.stage.save(true);
		},
		combineSelected : function () {
			var x, y, w = 0, h = 0, xs = [], ys = [];

			for(var i = 0; i < this.stage.selected.length; i++){
				var item = this.stage.selected[i];
				if(!x || item.x < x)x = item.x;
				if(!y || item.y < y)y = item.y;

				if(xs.indexOf(item.x) < 0){
					xs.push(x);
					w += item.w;
				}
				if(ys.indexOf(item.y) < 0){
					ys.push(y);
					h += item.h;
				}

			}

			this.combineTiles(x, y, w, h);
			this.visualItem = 'selection';
			setTimeout(function () {
				$rootScope.visualItem = 'selection';
				$rootScope.$apply();
			}, 500);
		}
	}
	var visualMode = new VisualMode;
	$rootScope.visualItem = 'selection';

	return visualMode;
}]);