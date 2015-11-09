var fs = require('fs'),
	dir = process.cwd();
module.exports = function (app) {
	function isAdmin(req, res, next) {
	    if (req.session.account.admin)
	        return next();
	    res.redirect('/');
	}
	/**
	 * Map Creator Routes
	 */
	app.get('/map-creator', isAdmin, function (req, res) {
		res.render('views/admin/mapCreator/index', {page : 'mapcreator'});
	});
	app.post('/mapcreator-save-map', isAdmin, function (req, res) {
		var mapJson = req.body.mapJson,
			map = req.body.map,
			layout = req.body.layout;

		fs.writeFile(dir + '/main/game/map/maps/' + map + '/layouts/' + layout + '.js', "define('game/map/maps/"  + map + "/layouts/" + layout + "', function(){\nreturn " + mapJson + ";\n});", 'utf8', function(){
			res.send('yep');
		});
	});
	app.get('/mapcreator-menu-items/:map', isAdmin, function (req, res) {
		var map = req.params.map,
			items = require(dir + '/main/game/map/maps/' + map + '/loadManifest.json');

		res.render('views/admin/mapCreator/itemMenu', {items : items});
	});
	app.get('/mapcreator-menu-controls', isAdmin, function (req, res) {
		res.render('views/admin/mapCreator/controlsMenu');
	});
	app.get('/mapcreator-menu-get-maps', isAdmin, function (req, res) {
		var map1 = fs.readdirSync(process.cwd() + '/main/game/map/maps/map1/layouts').map(function(v){return v.split('.')[0]});
			// map2 = fs.readdirSync(process.cwd() + '/main/game/map/maps/map2/layouts').map(function(v){return v.split('.')[0]});
		res.render('views/admin/mapCreator/mapMenu', {map1 : map1});
	});
	
}