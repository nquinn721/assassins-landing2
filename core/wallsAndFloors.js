define('core/wallsAndFloors', ['core/props'], function (props) {
	return [
		{w : props.canvas.w, h : 20, x : 0, y : props.canvas.h - 20, type : 'static', id : 'floor', policies : ['floor']},
		{w : props.canvas.w, h : 20, x : 0, y : 0, type : 'static'},
		{w : 20, h : props.canvas.h, x : 0, y : 0, type : 'static', policies : ['wall']},
		{w : 20, h : props.canvas.h, x : props.canvas.w - 20, y : 0, type : 'static', policies : ['wall']}
	]
})