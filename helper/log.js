// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
'use strict';

var fn = function(fnName) {
    var callback = console[fnName];

    return function() {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

        var logLevel = args.slice(-1)[0];

        if (window.LOG_LEVEL >= logLevel) {
            callback.apply(console, args.slice(0, -1));
        }
    }
};

var logger = {
    LOW: 1,
    MID: 2,
    HIGH: 3,
    log: fn('log'),
    info: fn('info'),
    warn: fn('warn'),
    error: fn('error'),
};

module.exports = logger;
