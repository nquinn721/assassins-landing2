require.config({
    baseUrl: '/',
    shim : {
    	angular : {
    		exports : 'angular'
    	},
        ngRoute : {
            exports : 'ngRoute'
        },
        '$' : {
            exports : '$'
        }
        // createjs : {
            // exports : 'createjs'
        // }
    },
    paths: {
    	io : '/socket.io/socket.io',
    	// createjs : '/lib/createjs',
        domReady : '/lib/requirejs-domready/domReady', 
        angular : '/lib/angularjs/angular.min',
        ngRoute : '/lib/angular-route/angular-route.min',
        '$' : '/lib/jquery/dist/jquery'
    },
    deps : ['/game/js/main.js']
});