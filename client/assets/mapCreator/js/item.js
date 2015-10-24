MC.factory('Item', [function () {
	function Item(stage, img, obj) {
		this.type = 'floor';
		this.w = 50;
		this.h = 50;
		img.scaleX = obj.w / img.image.width;
		img.scaleY = obj.h / img.image.height;
		img.x = obj.x;
		img.y = obj.y;
		this.img = img;
		
		for(var i in obj)this[i] = obj[i];

		this.stage = stage;
	}
	Item.prototype = {
		init : function () {
			this.img.on('pressmove', this.startMove.bind(this));
			this.img.on('pressup', this.stopMove.bind(this));
			this.img.on('click', this.chooseSelect.bind(this));
		},
		chooseSelect : function () {
			if(!this.selected)this.select();	
			else if(!this.moving && this.selected)this.deselectByItem();
		},
		startMove : function() {
			if(!this.selected)this.select();
			this.stage.movingItems = true;
			this.moving = true;
		},
		stopMove : function () {
			this.stage.movingItems = false;
			this.moving = false;
		},
		move : function (obj) {

			if(obj.movedRow){
				this.img.y += obj.movedY;
				this.y += obj.movedY;
				this.bg.y += obj.movedY;
				this.row += obj.movedRow;
			}
				
			if(obj.movedColumn){
				this.img.x += obj.movedX;
				this.x += obj.movedX;
				this.bg.x += obj.movedX;
				this.column += obj.movedColumn;
			}
		},
		select : function () {
			var bg = new createjs.Shape();
			bg.graphics.beginStroke("red").drawRect(this.x - 1, this.y - 1, this.w + 1, this.h + 1);
			this.stage.stage.addChild(bg);
			this.bg = bg.graphics.command;
			this.selectedBg = bg;
			this.selected = true;
			this.stage.selected.push(this);
		},
		deselectByItem : function () {
			this.deselect();	
			this.stage.selected.splice(this.stage.selected.indexOf(this), 1);
		},
		deselect : function (){
			this.selected = false;
			this.stage.stage.removeChild(this.selectedBg);
		},
		delete : function () {
			this.stage.stage.removeChild(this.selectedBg);
			this.stage.stage.removeChild(this.img);
		}
	}

	return Item;
}]);