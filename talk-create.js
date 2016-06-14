'use strict';

var allowedRequest = require('./helper/allowed-request');
var authenticate = require('./authenticate');
var formatObject = require('./helper/format-object');
var fs = require('fs');
var lorem = require('lorem-ipsum');
var page = require('webpage').create();
var prefix = require('./helper/prefixargs');
var Q = require('q');
var system = require('system');
var self = this;

this.LOG_LEVEL = 1;
this.ENV = 'local';
this.MOBILE = false;

system.args.forEach(function(arg) {
    if (arg.indexOf('--log-level') !== -1) {
        self.LOG_LEVEL = arg.split('=')[1];
    } else if (arg.indexOf('--mobile') !== -1) {
        self.MOBILE = true;
    }
});

var userAgent = this.MOBILE === true ? 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36' 
                                     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36';

page.customHeaders = {
    'User-Agent': userAgent,
    'Authorization': 'Basic ' + btoa('eventials:w3b1n4r!@#'),
};

page.onConsoleMessage = function(msg) {
    console.log('[spider.js] onConsoleMessage <<<');
    console.log('    ', msg);
    console.log('>>>\n');
};

page.onResourceRequested = function(requestData, request) {
    if (!allowedRequest(requestData.url)) {
        // console.log('[spider.js] onResourceRequested <<<');
        // console.log('     ABORT: ' + requestData.url);
        // console.log('>>>\n');
        request.abort();
    }
};

// page.onResourceReceived = function(response) {
//     console.log('[spider.js] onResourceReceived <<<');
//     console.log( formatObject(response) );
//     console.log('>>>\n');
// }

page.onLoadFinished = function(status) {
    // console.log('[spider.js] onLoadFinished <<<');
    // console.log('    ', status);
    // console.log('>>>\n');
};

page.onResourceError = function(resourceError) {
    // ignore url we forcely aborted
    if (resourceError.status === null && resourceError.url === '') {
        return;
    }

    // ignores this weird error until we learn what it is
    // {"errorCode":301,"errorString":"Protocol \"\" is unknown","url":""}
    if (resourceError.errorCode === 301 && resourceError.errorString === 'Protocol "" is unknown' && resourceError.url.length === 0) {
        return;
    }

    console.error('[spider.js] onResourceError <<<');
    console.log( formatObject(resourceError) );
    console.log('>>>\n');
};

page.onUrlChanged = function(targetUrl) {
    console.log('[spider.js] onUrlChanged <<<');
    console.log('   ', targetUrl);
    console.log('>>>\n')
};

page.onError = function(msg, trace) {
    console.error('[spider.js] onError <<<')
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');

        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }

    console.log(msgStack.join('\n'));
    console.error('>>>');
};

page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log('[spider.js] onNavigationRequested <<<');
    console.log('    url: ', url);
    console.log('    type: ', type);
    // console.log('    willNavigate: ', willNavigate);
    // console.log('    main: ', main);
    console.log('>>>\n');
}

page.onCallback = function(data) {  
    console.log('[spider.js] onCallback <<<');
    data.message && console.log(data.message);
    data.exit && phantom.exit();
    console.log('>>>\n');
};

if (fs.isFile('cookie.txt')) {
    phantom.addCookie(JSON.parse(fs.read('cookie.txt')))
}

var navegationPromise = Q.fcall(function() {
    return authenticate('pop', 'pop');
});

navegationPromise = navegationPromise.then(function() {
    var deferred = Q.defer();

    var url = prefix + 'talk-create';

    page.open(url, function(status) {
        if (status !== 'success') {
            console.error('[spider.js] page.open <<<')
            console.error('    Failed to open', page.frameUrl);
            console.error('>>>');
            deferred.reject('page.open deu problema...');
        }

        console.log('[spider.js] page.open <<<');
        console.log('    Title: ' + page.title);
        console.log('    Url: ' + page.url);
        console.log('>>>\n');

        var title = lorem();
        var description = lorem();

        page.evaluate(function(title, description) {
            document.getElementById('id_title').value = title;
            document.getElementById('id_description').value = description;
            document.getElementById('id_category').value = 1;
            document.querySelector('input[name=ticket_price]').value = '255,99';
            document.querySelector('form').submit();
        }, title, description);

        deferred.resolve('Ok!');
    });

    return deferred.promise;
});

navegationPromise = navegationPromise.delay(100); // magic number

navegationPromise = navegationPromise.fail(function(error) {
    console.error('fail <<<')
    console.error(error);
    console.error('>>>')
});

navegationPromise = navegationPromise.done(function(result) {
    console.info('[done] result: ' + result)
    phantom.exit();
});

function delay(ms) {
    var deferred = Q.defer();
    setTimeout(deferred.resolve, ms);
    return deferred.promise;
}
