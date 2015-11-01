var fs = require('fs'),
	dir = process.cwd();
module.exports = function (app) {
	/**
	 * Map Creator Routes
	 */
	app.post('/mapcreator-save-map', function (req, res) {
		var mapJson = req.body.mapJson,
			map = req.body.map,
			layout = req.body.layout;

		fs.writeFile(dir + '/main/game/map/maps/' + map + '/layouts/' + layout + '.js', "define('game/map/maps/"  + map + "/layouts/" + layout + "', function(){\nreturn " + mapJson + ";\n});", 'utf8', function(){
			res.send('yep');
		});
	});
	app.get('/mapcreator-menu-items/:map', function (req, res) {
		var map = req.params.map,
			items = require(dir + '/main/game/map/maps/' + map + '/loadManifest.json');

		res.render('views/mapCreator/itemMenu', {items : items});
	});
	app.get('/mapcreator-menu-controls', function (req, res) {
		res.render('views/mapCreator/controlsMenu');
	});
	app.get('/mapcreator-menu-get-maps', function (req, res) {
		var map1 = fs.readdirSync(process.cwd() + '/main/game/map/maps/map1/layouts').map(function(v){return v.split('.')[0]}),
			map2 = fs.readdirSync(process.cwd() + '/main/game/map/maps/map2/layouts').map(function(v){return v.split('.')[0]});
		res.render('views/mapCreator/mapMenu', {map1 : map1, map2 : map2});
	});
	
}