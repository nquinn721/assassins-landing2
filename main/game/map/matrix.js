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
			var id, i, j, k, h;


			this.width = props.canvas.w / matrix[0].length;
			this.height = props.canvas.h / matrix.length;
			this.items = [];
			this.item = undefined;

			for(i = 0; i < matrix.length; i++){
				var prevSegment;
				for(j = 0; j < matrix[i].length; j++){
					var segment = matrix[i][j],
						remainingRows = matrix.length - i,
						currentRow = i,
						currentColumn = j;

					// Continue if it equals zero
					if(segment === 0){
						if(this.item){
							this.items.push(this.item);
							this.item = undefined;
						}

						continue;
					}

					if(!this.item){ 
						this.createItem(currentRow, currentColumn, matrix, segment);
						prevSegment = segment;	
					}else if(prevSegment === segment){
						this.item.w += this.width;
						// Clear next clumn height below item
						for(var p = 0; p < this.item.heightItems; p++)
							if(matrix[currentRow + p + 1])matrix[currentRow + p + 1][j] = 0;
					}else {
						this.items.push(this.item);
						this.item = null;
						this.createItem(currentRow, currentColumn, matrix, segment);
					}
					
				}
			}

			if(this.item)
				this.items.push(this.item);
			return this.items;
		},
		createItem : function (currentRow, currentColumn, matrix, segment) {
			var id = this.elements[segment].id;

			this.item = new this.elements[segment].el({
				id : id + this.getItemCount(id),
				w : this.width,
				h : 0,
				x : currentColumn * this.width,
				y : currentRow * this.height,
				heightItems : 0
			});

			// Get height from first column of item
			for(var nextRow = currentRow; nextRow < matrix.length; nextRow++){
				var newSegment = matrix[nextRow][currentColumn];
				if(newSegment === segment){
					this.item.h += this.height;
					this.item.heightItems++;
					matrix[nextRow][currentColumn] = 0;
				}else{
					break;
				}
			}
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