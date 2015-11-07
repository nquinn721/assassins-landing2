define("game/map/matrix", [
		"core/props", 
		'game/map/elements/element',
	], function (props, element) {
	
	function Matrix () {
		this.newelements = {
			floor : 'platforms/floor',
			morefloor : 'platforms/morefloor',
			wall : 'platforms/wall',
			elevator : 'platforms/elevator',
			movingplatform : 'platforms/movingplatform',
			spikePit : 'pits/spikePit',
			base : 'structures/base',
			smallPotion : 'items/potions/smallPotion',
			box : 'boxes/box',
			boxWithPotion : 'boxes/boxWithPotion'
		};
		this.elements = {
			f : 'platforms/floor',
			w : 'platforms/wall',
			e : 'platforms/elevator',
			m : 'platforms/movingplatform',
			s : 'pits/spikePit',
			b : 'structures/base',
			sp : 'items/potions/smallPotion',
			bx : 'boxes/box',
			bwp : 'boxes/boxWithPotion'
		};

		this.items = [];
		
	}

	Matrix.prototype = {
		mapItems : function (items) {
			for(var i = 0; i < items.length; i++){
				var it = items[i],
					item = this.newelements[items[i].id],
					id = item.split('/')[1];
				it.id = it.type;
				it.id = id + this.getItemCount(id)

				this.items.push(element.extend(item, it))

			}
			return this.items;	
		},
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
					}else if(segment === prevSegment){
						prevSegment = segment;
						this.item.w += this.width;
						this.item.widthItems++;
						// Clear next clumn height below item
						for(var p = 0; p < this.item.heightItems; p++)
							if(matrix[currentRow + p])matrix[currentRow + p][j] = 0;
					}else {
						this.items.push(this.item);
						this.item = null;
						this.createItem(currentRow, currentColumn, matrix, segment);
						prevSegment = segment;	
					}
					
				}
			}

			if(this.item)
				this.items.push(this.item);
			return this.items;
		},
		createItem : function (currentRow, currentColumn, matrix, segment) {
			var item = this.elements[segment.replace(/\s/g, '')],
				id = item.split('/')[1];

			this.item = element.extend(item, {
				id : id + this.getItemCount(id),
				w : this.width,
				h : 0,
				x : currentColumn * this.width,
				y : currentRow * this.height,
				heightItems : 0,
				widthItems : 0
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