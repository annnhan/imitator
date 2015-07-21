/**
 * Created by an.han on 15/7/19.
 */

var child_process = require('child_process');
var path = require('path');

var comment = process.argv[2];

var cp = child_process.exec(
        'git commit -am "' + comment + '" && git push && cnpm publish',
        {cwd: path.resolve(__dirname, '..')});

cp.stdout.on('data', function (data) {
    console.log(data + '');
})


