module.exports = function(imitator) {

    // 返回一个json
    imitator({
        url: '/json',
        result: {name: 'json test'}
    });

    // 返回一个json
    imitator('/json2', {name: 'json test2'});

    // 返回一个字符串
    imitator('/string', 'string test');

    // 返回一个数字
    imitator('/number', 123);

    // 返回文件内容, 文件路径相对于 Imitatorfile 文件目录
    imitator('/file', imitator.file('./myfile.txt'));

    // 正则匹配url, 返回一个字符串
    imitator(/\/regexp/, 'regexp test');

    // option.result 参数如果是一个函数, 可以实现自定义返回内容, 接收的参数是是经过 exrpess 封装的 req 和 res 对象.
    imitator(/\/function$/, function (req, res) {
        res.send('function test');
    });

    // 更复杂的规则配置
    imitator({
        url: /\/who/,
        result: function (req, res) {
            if (req.param.name === 'hanan') {
                res.send('中年痴呆症患者');
            }
            else {
                res.send('i do not know .');
            }
        },
        type: 'text',
        headers: {
            imitatorFile: __filename
        },
        cookies: [
            {name: 'myname', value: 'hanan', maxAge: 900000, httpOnly: true}
        ]
    });

    // 没有命中规则的请求, 转发到localhost:9000下
    imitator.base('http://localhost:9000');
}

