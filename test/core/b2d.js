'use strict';
var requirejs = require(process.cwd() + "/test/requirejsSettings.js");
var expect = require('chai').should();

describe('b2d requirejs class with dependencies on box2d and body', function() {
    // Load modules with requirejs before tests
    var mod, box, bod;
    before(function(done) {
        requirejs(['b2d', 'lib/box2d', 'body'], function(module, box2d, body) {
            mod = module;
            box = box2d;
            bod = body;
            done(); // We can launch the tests!
        });
    });


    describe('b2d class properties', function(){
        it('should have a scale of 30', function(){
        	mod.SCALE.should.equal(30);
        });

        it('should get correct dependencies', function () {
        	mod.box2d.should.equal(box);
        	mod.body.should.equal(bod);
        });
    });

});
