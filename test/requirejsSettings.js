var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,
    baseUrl: process.cwd() + '/core',
});

module.exports = requirejs;