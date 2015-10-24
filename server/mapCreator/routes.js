var fs = require('fs'),
	dir = process.cwd();
module.exports = function (app) {
	/**
	 * Map Creator Routes
	 */
	app.post('/save-map', function (req, res) {
		var mapJson = req.body.mapJson,
			map = req.body.map,
			layout = req.body.layout;
		fs.writeFile(dir + '/client/assets/maps/' + map + '/layouts/' + layout + '.js', "define('maps/"  + map + "/layouts/" + layout + "', function(){\nreturn " + mapJson + ";\n});", 'utf8', function(){
			res.send('yep');
		});
	});
	app.get('/items/:map', function (req, res) {
		var map = req.params.map,
			items = require(dir + '/client/assets/maps/' + map + '/loadManifest.json');

		res.render('views/mapCreator/itemMenu', {items : items});
	});
	app.get('/get-maps', function (req, res) {
		var map1 = fs.readdirSync(process.cwd() + '/client/assets/maps/map1/layouts').map(function(v){return v.split('.')[0]}),
			map2 = fs.readdirSync(process.cwd() + '/client/assets/maps/map2/layouts').map(function(v){return v.split('.')[0]});
		res.render('views/mapCreator/mapMenu', {map1 : map1, map2 : map2});
	});
	
}