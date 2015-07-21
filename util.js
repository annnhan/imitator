/**
 * Created by an.han on 15/7/21.
 */

var toString = Object.prototype.toString;

module.exports = {
    isArray: function (value) {
        return toString.call(value) === '[object Array]';
    },
    isObject: function (value) {
        return toString.call(value) === '[object Object]';
    },
    isFunction: function (value) {
        return toString.call(value) === '[object Function]';
    }
}