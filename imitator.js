/**
 * Created by an.han on 15/7/20.
 */
var Promise = require('es6-promise').Promise;
var util = require('./util');
var http = require('http');
var app = global.app;

function request(url, req, res) {

}

function imitator (url, result) {
    var len = arguments.length
    if (len === 0) {
        return imitator;
    }
    else if (len === 1){
        if (util.isObject(url)) {
            imitator.complex(url);
        }
        if (util.isArray(url)){
            imitator.multiple(url);
        }
    }
    else {
        imitator.simple(url, result);
    }
    return imitator;
}

imitator.base = function (host) {
    process.nextTick(function () {
        app.use(function (req, res, next) {
            request(host.replace(/\/$/, '') + req.url, req, res);
        });
    });
}

imitator.rewrite = function (url, rewrite) {
    app.use(url, function (req, res, next) {
        var group = url.exec(req.url);
        var requestUrl = rewrite.replace(/\$(\d+)/g, function ($0, d) {
            return group[d];
        });
        request(requestUrl, req, res);
    });
}

imitator.simple = function (url, result) {

}

imitator.complex = function (option) {

}

imitator.multiple = function (list) {

}

module.exports = imitator;