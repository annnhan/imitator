#!/usr/bin/env node

var child_process = require('child_process');
var path = require('path');
var pg = require('../package.json');

var comment = process.argv[2] || ('commit version@' + pg.version);

var cp = child_process.exec(
        'git commit -am "' + comment + '" && git push && npm publish',
        {cwd: path.resolve(__dirname, '..')});

cp.stdout.on('data', function (data) {
    console.log(data + '');
})


