/**
 * Created by an.han on 15/7/20.
 */
var Promise = require('es6-promise').Promise;
var URL = require('url');
var util = require('./util');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = global.app;

// log proxy data
proxy.on('open', function (proxySocket) {
    proxySocket.on('data', function (chunk) {
        console.log(chunk.toString());
    });
});

// 根据参数个数获取配置
function getOption(arg) {
    var len = arg.length;
    // 默认配置
    var option = {
        headers: {
            'Cache-Control': 'no-cache'
        },
        statusCode: 200,
        cookies: [],
        timeout: 0
    };
    if (len === 0) {
        return imitator;
    }
    else if (len === 1) {
        var newOption = arg[0];
        if (util.isObject(newOption)) {
            util.each(newOption, function (value, key) {
                if (key === 'headers') {
                    util.each(newOption.headers, function (headervalue, headerkey) {
                        option.headers[headerkey] = newOption.headers[headerkey];
                    })
                }
                else {
                    option[key] = newOption[key];
                }
            });
        }
    }
    else {
        option.url = arg[0];
        option.result = arg[1];
    }
    return option;
}

function imitator() {
    var option = getOption(arguments);

    if (!option.url || !option.result) {
        return;
    }

    app.use(option.url, function (req, res) {
        setTimeout(function () {

            // set header
            res.set(option.headers);

            // set Content-Type
            option.type && res.type(option.type);

            // set status code
            res.status(option.statusCode);

            // set cookie
            util.each(option.cookies, function (item, index) {
                var name = item.name;
                var value = item.value;
                delete item.name;
                delete item.value;
                res.cookie(name, value, item);
            });

            // do result
            if (util.isFunction(option.result)) {
                option.result(req, res);
            }
            else if (util.isArray(option.result) || util.isObject(option.result)) {
                !option.type && res.type('json');
                res.json(option.result);
            }
            else {
                !option.type && res.type('text');
                res.send(option.result.toString());
            }

        }, option.timeout);
    });
}

// 规则之外的请求转发
imitator.base = function (host) {
    process.nextTick(function () {
        app.use(function (req, res) {
            proxy.web(req, res, {target: host});
        });
    });
}


module.exports = imitator;