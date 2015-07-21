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
    },

    each: function (val, callback) {
        if (this.isArray(val)) {
            val.forEach(callback);
        }
        if (this.isObject(val)) {
            for (var key in val) {
                callback(val[key], key);
            }
        }
    }
}