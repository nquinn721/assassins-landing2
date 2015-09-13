define("game/map/matrix", ["core/props", "core/lib/underscore"], function (props, _) {
	
	function Matrix (elements) {
		var element = 1;
		this.mapper = {};


		for(var i in elements){
			this.mapper[element] = i;
			element++;
		}
		
		this.items = [];
	}

	Matrix.prototype = {
		map : function (matrix) {
			var width = props.canvas.w / matrix[0].length,
				height = props.canvas.h / matrix.length,
				item, i, j, k, h;

			console.log(width, height, props.canvas.h, props.canvas.w);
			for(i = 0; i < matrix.length; i++){
				for(j = 0; j < matrix[i].length; j++){
					var segment = matrix[i][j];

					// Continue if it equals zero
					if(segment === 0){
						if(item){
							console.log(item);
							this.items.push(item);
							item = undefined;
						}

						continue;
					}

					if(!item){ 
						item = {
							id : this.mapper[segment] + (this.getItemCount(this.mapper[segment]) || 0),
							element : this.mapper[segment],
							w : width,
							h : height,
							x : j * width,
							y : i * height,
						}
					}else{
						item.w += width;
					}

					// if(i > 0)
					// 	if(segment === matrix[i - 1][j])item.h += height;



					matrix[i][j] = 0;

				}
			}

			if(item)this.items.push(item);
		},
		getItemCount : function (id) {
			var total = 0;
			for(var i = 0; i < this.items.length; i++)
				if(this.items[i].id.match(id))total++;
			return total;
		},
		getById : function (id) {
			return _.findWhere(this.items, {id : id});
		}
	}


	return Matrix;
})