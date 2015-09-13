define("game/map/matrix", [
		"core/props", 
		'game/map/elements/platforms/floor',
		'game/map/elements/platforms/wall',
		'game/map/elements/platforms/ceiling',
		'game/map/elements/platforms/elevator',
		'game/map/elements/platforms/movingplatform'
	], function (props, floor, wall, ceiling, elevator, movingplatform) {
	
	function Matrix () {
		this.elements = {
			1 : {
				el : floor,
				id : 'floor'
			},
			2 : {
				el : wall,
				id : 'wall'
			},
			3 : {
				el : ceiling,
				id : 'ceiling'
			},
			4 : {
				el : elevator,
				id : 'elevator'
			},
			5 : {
				el : movingplatform,
				id : 'movingplatform'
			}
		};


		
	}

	Matrix.prototype = {
		map : function (matrix) {
			var width = props.canvas.w / matrix[0].length,
				height = props.canvas.h / matrix.length,
				item, id, i, j, k, h;

			this.items = [];

			for(i = 0; i < matrix.length; i++){
				for(j = 0; j < matrix[i].length; j++){
					var segment = matrix[i][j];

					// Continue if it equals zero
					if(segment === 0){
						if(item){
							this.items.push(item);
							item = undefined;
						}

						continue;
					}

					if(!item){ 
						id = this.elements[segment].id
						item = new this.elements[segment].el({
							id : id + this.getItemCount(id),
							w : width,
							h : height,
							x : j * width,
							y : i * height,
						});
					}else{
						item.w += width;
					}

					// if(i > 0)
					// 	if(segment === matrix[i - 1][j])item.h += height;



					matrix[i][j] = 0;

				}
			}

			if(item)this.items.push(item);

			return this.items;
		},
		getItemCount : function (id) {
			var total = 0;
			for(var i = 0; i < this.items.length; i++)
				if(this.items[i].id.match(id))total++;
			return total;
		}
	}

	return new Matrix;
})