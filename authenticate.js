'use strict';

var fs = require('fs');
var prefix = require('./helper/prefixargs');
var Q = require('q');
var system = require('system');
var webpage = require('webpage');

var page = webpage.create();

page.customHeaders = {
    'Authorization': 'Basic ' + btoa('eventials:w3b1n4r!@#'),
};

var url = prefix + 'login/';
var tries = 0;
var deferred = Q.defer();

page.onLoadFinished = function(status) {
    console.log('[authenticate.js] onLoadFinished <<<');
    console.log('    status:', status);
    console.log('    url:', page.url);
    console.log('>>>\n');

    tries = tries + 1;

    if (page.url.indexOf('/dashboard') !== -1) {
        phantom.cookies.forEach(function(element) {
            if (element['name'] === 'sessionid') {
                fs.write('cookie.txt', JSON.stringify(element), "w");
                deferred.resolve();
                return;
            }
        });
        return;
    }

    if (tries >= 2) {
        console.warn('Probably the user and password are wrong');
        deferred.reject(new Error('Probably the user and password are wrong'));
    }
};

function lazyInit(username, password) {
    page.open(url, function (status) {
        if (status !== 'success') {
            deferred.reject(new Error('Authenticate could not reach page to login'));
        }


        // page.evaluateJavaScript('function() { return window.password = "' + password + '" })');
        // page.evaluateJavaScript('function() { return window.username = "' + username + '" })');

        // maybe we step thru login because we are already authenticated
        if (page.url.indexOf('dashboard') === -1) {
            page.evaluate(function(username, password) {
                document.getElementById('id_username').value = username;
                document.getElementById('id_password').value = password;
                document.getElementsByTagName('form')[0].submit();
            }, username, password);
        }
    });

    return deferred.promise;
}

module.exports = lazyInit;
