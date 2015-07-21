module.exports = function(imitator) {

    console.log('path of imitatorFile is', __filename);

    imitator.base('http://tuan.qunar.com');

    imitator('/json', {name: 'test'});

    imitator('/string', 'string test');

    imitator('/number', 123);

    imitator(/\/regexp/, 'regexp test');

    imitator(/\/function$/, function (req, res) {
        res.send('function test');
    });

    imitator({
            url: '/option',
            result: 'hello world',
            type: 'text',
            headers: {
                imitatorFile: __filename
            },
            cookies: [
                {name: 'myname', value: 'hanan', maxAge: 900000, httpOnly: true}
            ]
        }
    );

    imitator(/.*/, 'not macth any rule!');
}

