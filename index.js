'use strict';

var system = require('system');
var page = require('webpage').create();
var urls = require('./urls');
var helper = require('./helper/log');
var self = this;

this.LOG_LEVEL = 1;
this.ENV = 'local';
this.MOBILE = false;

system.args.forEach(function(arg) {
    if (arg.indexOf('--log-level') !== -1) {
        self.LOG_LEVEL = arg.split('=')[1];
    } else if (arg.indexOf('--env') !== -1) {
        self.ENV = arg.split('=')[1];
    } else if (arg.indexOf('--mobile') !== -1) {
        self.MOBILE = true;
    }
});

var prefix = '';

switch(this.ENV) {
    case 'staging':
        prefix = 'https://staging.eventials.com/';
        break;

    case 'local':
    default:
        prefix = 'http://local.eventials.com/';
        break;
}

var userAgent = this.MOBILE === true ? 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36';

page.customHeaders = {
    'User-Agent': userAgent,
    'Authorization': 'Basic ' + btoa('eventials:w3b1n4r!@#'),
};

console.info(JSON.stringify(page.customHeaders));

page.onConsoleMessage = function(msg) {
    helper.log('Console: ', msg, helper.LOW);
};

page.onResourceRequested = function(requestData, request) {
    helper.log('onResourceRequested', 3);

    var allowedRequests = ['eventials', 'cloudfront', 'googleapis', 'gstatic'].join('|');

    var url = requestData.url;

    var re = new RegExp(allowedRequests);

    if (re.test(url) === false) {
        helper.log('Not allowed request, aborting: ' + requestData.url, helper.MID);
        request.abort();
    }
};

page.onLoadFinished = function(status) {
    helper.log('onLoadFinished: ', status, helper.LOW);
    getItem();
};

page.onResourceError = function(resourceError) {
    // ignore url we forcely aborted
    if (resourceError.status === null) {
        return;
    }

    helper.log('Error', helper.LOW);
    helper.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')', helper.LOW);
    helper.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString, helper.LOW);
    helper.log('URL: ', resourceError.url, helper.LOW);
    helper.log('End Error', helper.LOW);
};

page.onUrlChanged = function(targetUrl) {
    helper.log('onUrlChanged', targetUrl, helper.MID);
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');

        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }

    helper.log(msgStack.join('\n'), helper.LOW);
};

function getItem() {
    var url = urls.shift();

    if (url === undefined) {
        phantom.exit();
        return;
    }

    url = prefix + url;

    page.open(url, function(status) {
        helper.log('Title: ', page.title, ' Url: ', page.url, 'Status: ', status, helper.LOW);

        page.evaluate(function() {
            helper.log('Evaluate ', document.title, helper.LOW);
        });
    });
}

// init
getItem();
